import prisma from "../../db";
import { LedgerType } from "@prisma/client";

interface QueryLedgerParams {
  page?: number;
  pageSize?: number;
  walletId?: string;
  entityType?: string;
  entityId?: string; // for bookingId or other entities
  type?: LedgerType;
  from?: string;
  to?: string;
}

interface CreateManualEntryParams {
  walletId?: string;
  bookingId?: string;
  amount: number;
  type: LedgerType;
  description?: string;
}

export const LedgerService = {
  /**
   * Query ledger entries with filters and pagination
   */
  async query(params: QueryLedgerParams) {
    const { page = 1, pageSize = 50, walletId, entityType, entityId, type, from, to } = params;

    const where: any = {};
    if (walletId) where.walletId = walletId;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (type) where.type = type;
    if (from || to) where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);

    const entries = await prisma.ledgerEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = await prisma.ledgerEntry.count({ where });

    return { total, page, pageSize, entries };
  },

  /**
   * Create a manual ledger entry (admin use)
   */
  async createManualEntry(params: CreateManualEntryParams) {
    const { walletId, bookingId, amount, type, description } = params;

    const ledger = await prisma.ledger.create({
      data: {
        type,
        description,
        walletId,
        entityType: bookingId ? "BOOKING" : undefined,
        entityId: bookingId ?? undefined,
        amount,
      },
    });

    const entry = await prisma.ledgerEntry.create({
      data: {
        ledgerId: ledger.id,
        walletId,
        bookingId,
        amount,
        direction: amount >= 0 ? "CREDIT" : "DEBIT",
        note: description,
      },
    });

    return entry;
  },
};
