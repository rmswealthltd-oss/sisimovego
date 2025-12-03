// src/lib/ledger.ts
import { PrismaClient, Prisma, LedgerType } from "@prisma/client";
import prisma from "../db";

type LedgerTx = Prisma.TransactionClient | PrismaClient;

/**
 * Small ledger helpers used across services.
 */

/**
 * Create a ledger entry
 */
export async function createLedgerEntry(
  tx: LedgerTx,
  data: {
    bookingId?: string;
    walletId?: string;
    amount: number;
    type: LedgerType; // ← use enum here
    description?: string;
  }
) {
  return tx.ledger.create({
    data: {
     
      walletId: data.walletId ?? null,
      amount: data.amount,
      type: data.type, // ← value from enum
      description: data.description ?? null,
    },
  });
}

/**
 * Compute wallet balance by summing ledger entries
 */
export async function computeWalletBalance(walletId: string) {
  const agg = await prisma.ledger.aggregate({
    _sum: { amount: true },
    where: { walletId },
  });

  // _sum may be null, and amount may be null if no rows exist
  return agg._sum?.amount ?? 0;
}
