import prisma from "../../db";
import { EntryDirection } from "@prisma/client";

export const LedgerEntryService = {
  async createEntry(params: {
    ledgerId: string;         // required
    payoutId?: string;
    userId?: string;
    bookingId?: string;
    walletId?: string;
    amount: number;
    direction: EntryDirection; // CREDIT or DEBIT
    reference?: string;
    note?: string;
  }) {
    const { ledgerId, payoutId, userId, bookingId, walletId, amount, direction, reference, note } = params;

    const entry = await prisma.ledgerEntry.create({
      data: {
        ledgerId,
        payoutId: payoutId ?? undefined,
        userId: userId ?? undefined,
        bookingId: bookingId ?? undefined,
        walletId: walletId ?? undefined,
        amount,
        direction,
        reference: reference ?? undefined,
        note: note ?? undefined,
      },
    });

    await prisma.outboxEvent.create({
      data: {
        aggregateType: "LedgerEntry",
        aggregateId: entry.id,
        type: "LedgerEntryCreated",
        channel: "pubsub",
        status: "READY",
        payload: JSON.stringify({
          ledgerEntryId: entry.id,
          payoutId,
          userId,
          bookingId,
          walletId,
          amount,
          direction,
        }),
      },
    });

    return entry;
  },

  async queryEntries(params: {
    page?: number;
    pageSize?: number;
    walletId?: string;
    bookingId?: string;
    userId?: string;
    direction?: EntryDirection;
    from?: string;
    to?: string;
  }) {
    const { page = 1, pageSize = 50, walletId, bookingId, userId, direction, from, to } = params;
    const where: any = {};

    if (walletId) where.walletId = walletId;
    if (bookingId) where.bookingId = bookingId;
    if (userId) where.userId = userId;
    if (direction) where.direction = direction;

    if (from || to) {
      where.createdAt = {};
      if (from) {
        const d = new Date(from);
        if (!isNaN(d.getTime())) where.createdAt.gte = d;
      }
      if (to) {
        const d = new Date(to);
        if (!isNaN(d.getTime())) where.createdAt.lte = d;
      }
    }

    const [total, rows] = await Promise.all([
      prisma.ledgerEntry.count({ where }),
      prisma.ledgerEntry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      pageCount: Math.ceil(total / pageSize),
      rows,
    };
  },

  async sumWalletEntries(walletId: string) {
    const result = await prisma.ledgerEntry.aggregate({
      _sum: { amount: true },
      where: { walletId },
    });
    return result._sum?.amount ?? 0;
  },
};
