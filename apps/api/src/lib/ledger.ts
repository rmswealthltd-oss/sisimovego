// src/lib/ledger.ts
import prisma from "../db";

/**
 * Small ledger helpers used across services.
 */

export async function createLedgerEntry(tx: any, data: { bookingId?: string; walletId?: string; amount: number; type: string; description?: string }) {
  return tx.ledger.create({
    data: {
      bookingId: data.bookingId ?? null,
      walletId: data.walletId ?? null,
      amount: data.amount,
      type: data.type,
      description: data.description ?? null
    }
  });
}

/**
 * Compute wallet balance by summing ledger entries (safer than trusting wallet.balance if you want canonical)
 */
export async function computeWalletBalance(walletId: string) {
  const agg = await prisma.ledger.aggregate({
    _sum: { amount: true },
    where: { walletId }
  });
  return agg._sum.amount ?? 0;
}
