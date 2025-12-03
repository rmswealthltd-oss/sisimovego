// src/modules/driver/driverPayout.service.ts

import prisma from "../../db";
import { sendMpesaPayout } from "../../lib/sendMpesaPay";
import { LedgerType, LedgerEntityType, EntryDirection } from "@prisma/client";

export const DriverPayoutService = {
  async ensureDriverWallet(tx: any, userId: string) {
    let wallet = await tx.wallet.findFirst({
      where: { ownerId: userId, type: "DRIVER" },
    });

    if (!wallet) {
      wallet = await tx.wallet.create({
        data: { ownerId: userId, type: "DRIVER", balance: 0 },
      });
    }

    return wallet;
  },

  async payoutToDriver(params: {
    userId: string;
    amountCents: number;
    description?: string | null;
  }) {
    const { userId, amountCents, description } = params;

    if (amountCents <= 0) throw new Error("invalid_amount");

    const { payout, userPhone } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("user_not_found");
      if (!user.phone) throw new Error("missing_phone_number");

      const wallet = await this.ensureDriverWallet(tx, userId);

      if (wallet.balance < amountCents) throw new Error("insufficient_balance");

      // Debit wallet
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amountCents } },
      });

      // Create ledger for payout
      const ledger = await tx.ledger.create({
        data: {
          walletId: wallet.id,
          amount: amountCents,
          type: LedgerType.DRIVER_PAYOUT,
          entityType: LedgerEntityType.USER,
          description: description ?? `Driver payout for ${userId}`,
        },
      });

      // Ledger entry → debit
      await tx.ledgerEntry.create({
        data: {
          ledgerId: ledger.id,
          walletId: wallet.id,
          userId,
          amount: -amountCents,
          direction: EntryDirection.DEBIT,
          note: `Driver payout request`,
        },
      });

      // Create payout placeholder
      const payout = await tx.payout.create({
        data: {
          userId,
          driverId: null,
          batchId: null,
          amountCents,
          status: "PENDING",
          phone: user.phone,
          description: description ?? null,
        },
      });

      return { payout, userPhone: user.phone };
    });

    // STEP 2 — OUTSIDE TRANSACTION: Call MPESA
    try {
      await sendMpesaPayout({ phone: userPhone, amount: payout.amountCents / 100 });

      // Mark payout as completed
      await prisma.payout.update({
        where: { id: payout.id },
        data: { status: "COMPLETED" },
      });

      return { ok: true, payoutId: payout.id };
    } catch (err) {
      console.error("MPESA payout failed:", err);

      // Mark failed
      await prisma.payout.update({
        where: { id: payout.id },
        data: { status: "FAILED" },
      });

      // Refund wallet
      const wallet = await prisma.wallet.findFirst({
        where: { ownerId: payout.userId, type: "DRIVER" },
      });

      if (wallet) {
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: payout.amountCents } },
        });

        const refundLedger = await prisma.ledger.create({
          data: {
            walletId: wallet.id,
            amount: payout.amountCents,
            type: LedgerType.REFUND,
            entityType: LedgerEntityType.USER,
            description: `Refund: MPESA payout failed for ${payout.id}`,
          },
        });

        await prisma.ledgerEntry.create({
          data: {
            ledgerId: refundLedger.id,
            walletId: wallet.id,
            userId: payout.userId,
            amount: payout.amountCents,
            direction: EntryDirection.CREDIT,
            note: `Refund: MPESA payout failed for ${payout.id}`,
          },
        });
      }

      return { ok: false, payoutId: payout.id, error: String(err) };
    }
  },
};
