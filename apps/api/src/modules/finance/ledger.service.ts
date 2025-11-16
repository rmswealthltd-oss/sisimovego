// src/modules/finance/ledger.service.ts
import prisma from "../../db";

export const LedgerService = {
  /**
   * Query ledger entries with filters and pagination.
   */
  async queryLedger({ page = 1, pageSize = 50, walletId, bookingId, type, from, to }: {
    page?: number;
    pageSize?: number;
    walletId?: string;
    bookingId?: string;
    type?: string;
    from?: string;
    to?: string;
  }) {
    const where: any = {};
    if (walletId) where.walletId = walletId;
    if (bookingId) where.bookingId = bookingId;
    if (type) where.type = type;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [total, rows] = await Promise.all([
      prisma.ledger.count({ where }),
      prisma.ledger.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    ]);

    return { total, page, pageSize, rows };
  },

  /**
   * Manual ledger entry creation (admin).
   */
  async createManualEntry({ walletId, bookingId, amount, type, description }: {
    walletId?: string;
    bookingId?: string;
    amount: number;
    type: string;
    description?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      // If walletId provided update wallet balance
      if (walletId) {
        await tx.wallet.update({
          where: { id: walletId },
          data: { balance: { increment: amount } }
        });
      }

      const entry = await tx.ledger.create({
        data: {
          walletId: walletId ?? null,
          bookingId: bookingId ?? null,
          amount,
          type,
          description
        }
      });

      // publish outbox for accounting downstream systems
      await tx.outbox.create({
        data: {
          aggregateType: "Ledger",
          aggregateId: entry.id,
          type: "LedgerEntryCreated",
          payload: JSON.stringify({ ledgerId: entry.id }),
          channel: "pubsub",
          status: "READY"
        }
      });

      return entry;
    });
  },

  /**
   * Sum ledger balance for a wallet (materialized helper).
   */
  async sumWalletBalance(walletId: string) {
    const rows = await prisma.ledger.aggregate({
      _sum: { amount: true },
      where: { walletId }
    });
    return rows._sum.amount ?? 0;
  }
};
