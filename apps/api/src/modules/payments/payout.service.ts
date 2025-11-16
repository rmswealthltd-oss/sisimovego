// src/modules/payments/payout.service.ts
import prisma from "../../db";

export const PayoutService = {
  /**
   * Ensure a wallet exists for a driver.
   */
  async getOrCreateDriverWallet(driverId: string) {
    let wallet = await prisma.wallet.findFirst({
      where: { ownerId: driverId, type: "DRIVER" }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { ownerId: driverId, type: "DRIVER", balance: 0 }
      });
    }
    return wallet;
  },

  /**
   * Create payout: debit system escrow, record ledger, outbox event.
   */
  async createPayout({ recipientId, recipientPhone, amountCents, currency = "KES", description }: {
    recipientId?: string;
    recipientPhone: string;
    amountCents: number;
    currency?: string;
    description?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      // system escrow
      let escrow = await tx.wallet.findFirst({ where: { ownerId: null, type: "ESCROW" } });
      if (!escrow) {
        escrow = await tx.wallet.create({ data: { ownerId: null, type: "ESCROW", balance: 0 } });
      }

      if (escrow.balance < amountCents) {
        throw new Error("insufficient_escrow_balance");
      }

      // debit escrow
      await tx.wallet.update({
        where: { id: escrow.id },
        data: { balance: { decrement: amountCents } }
      });

      await tx.ledger.create({
        data: {
          walletId: escrow.id,
          amount: -amountCents,
          type: "DRIVER_PAYOUT",
          description: description ?? `Payout ${recipientId ?? recipientPhone}`
        }
      });

      // driver wallet (for reconciliation/log only)
      let driverWallet = null;
      if (recipientId) {
        driverWallet = await this.getOrCreateDriverWallet(recipientId);
      }

      // create payout row
      const payout = await tx.payout.create({
        data: {
          driverId: recipientId ?? null,
          amount: amountCents,
          currency,
          providerTxId: null,
          status: "PENDING"
        }
      });

      // OUTBOX → payout.worker.ts
      await tx.outbox.create({
        data: {
          aggregateType: "Payout",
          aggregateId: payout.id,
          type: "PayoutRequested",
          payload: JSON.stringify({
            payoutId: payout.id,
            phone: recipientPhone,
            amount: amountCents
          }),
          channel: "worker",
          status: "READY"
        }
      });

      return payout;
    });
  },

  /**
   * Update after external Mpesa payout completes
   */
  async markPayoutSent(payoutId: string, providerTxId: string, status: string) {
    return prisma.payout.update({
      where: { id: payoutId },
      data: { providerTxId, status }
    });
  }
};
