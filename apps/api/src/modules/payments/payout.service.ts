// src/modules/payments/payout.service.ts
import prisma from "../../db";
import { PayoutStatus } from "@prisma/client";

export const PayoutService = {
  /**
   * Ensure a wallet exists for a driver.
   */
  async getOrCreateDriverWallet(driverId: string) {
    let wallet = await prisma.wallet.findFirst({
      where: { ownerId: driverId, type: "DRIVER" },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { ownerId: driverId, type: "DRIVER", balance: 0 },
      });
    }
    return wallet;
  },

  /**
   * Create payout: debit escrow, ledger, outbox event.
   */
  async createPayout({
    recipientId,
    recipientPhone,
    amountCents,
    description,
  }: {
    recipientId: string;
    recipientPhone: string;
    amountCents: number;
    description?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      // system escrow wallet
      let escrow = await tx.wallet.findFirst({
        where: { ownerId: null, type: "ESCROW" },
      });

      if (!escrow) {
        escrow = await tx.wallet.create({
          data: { ownerId: null, type: "ESCROW", balance: 0 },
        });
      }

      if (escrow.balance < amountCents) {
        throw new Error("insufficient_escrow_balance");
      }

      // debit escrow
      await tx.wallet.update({
        where: { id: escrow.id },
        data: { balance: { decrement: amountCents } },
      });

      // ledger entry
      await tx.ledger.create({
        data: {
          walletId: escrow.id,
          amount: -amountCents,
          type: "DRIVER_PAYOUT",
          description:
            description ?? `Payout to driver ${recipientId ?? recipientPhone}`,
        },
      });

      // driver wallet
      await this.getOrCreateDriverWallet(recipientId);

      // create payout row
      const payout = await tx.payout.create({
        data: {
          userId: recipientId,
          driverId: recipientId,
          amountCents,
          status: PayoutStatus.PENDING, // use enum
          phone: recipientPhone,
          description: description ?? null,
        },
      });

      // outbox event
      await tx.outboxEvent.create({
        data: {
          aggregateType: "Payout",
          aggregateId: payout.id,
          type: "PayoutRequested",
          payload: JSON.stringify({
            payoutId: payout.id,
            phone: recipientPhone,
            amount: amountCents,
          }),
          channel: "worker",
          status: "READY",
        },
      });

      return payout;
    });
  },

  /**
   * Mark payout completed by Mpesa
   */
  async markPayoutSent(payoutId: string, status: PayoutStatus) {
    return prisma.payout.update({
      where: { id: payoutId },
      data: { status },
    });
  },
};
