// src/modules/driver/driverPayout.service.ts
import prisma from "../../db";
import { sendMpesaPayout } from "../../lib/sendMpesaPay";

/**
 * Handles driver wallet payouts from ESCROW.
 * Assumes:
 * - ESCROW wallet type = ESCROW
 * - Driver wallets type = DRIVER
 */

export const DriverPayoutService = {
  async createDriverWalletIfMissing(tx: any, driverId: string) {
    let w = await tx.wallet.findFirst({
      where: { ownerId: driverId, type: "DRIVER" }
    });
    if (!w) {
      w = await tx.wallet.create({
        data: {
          ownerId: driverId,
          type: "DRIVER",
          balance: 0
        }
      });
    }
    return w;
  },

  async payoutToDriver(driverId: string, amountCents: number) {
    return prisma.$transaction(async (tx) => {
      let driverWallet = await this.createDriverWalletIfMissing(tx, driverId);

      if (driverWallet.balance < amountCents) {
        throw new Error("insufficient_driver_balance");
      }

      // debit driver wallet
      await tx.wallet.update({
        where: { id: driverWallet.id },
        data: { balance: { decrement: amountCents } }
      });

      await tx.ledger.create({
        data: {
          walletId: driverWallet.id,
          amount: -amountCents,
          type: "DRIVER_PAYOUT",
          description: `Driver payout to ${driverId}`
        }
      });

      // send MPESA payout
      const payout = await sendMpesaPayout({
        phone: "254" + Math.floor(Math.random() * 1000000000),
        amount: amountCents / 100
      });

      // record payout transaction
      await tx.payout.create({
        data: {
          driverId,
          amount: amountCents,
          providerTxId: payout.providerTxId,
          status: payout.status
        }
      });

      return payout;
    });
  }
};
