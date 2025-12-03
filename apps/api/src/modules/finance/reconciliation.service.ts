// src/modules/finance/reconciliation.service.ts
import prisma from "../../db";

export const ReconciliationService = {
  async reconcileBookings({ from, to }: { from?: string; to?: string }) {
    const fromDate = from ? new Date(from) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();

    // Fetch LedgerEntries whose Ledger.type is BOOKING_PAYMENT
    const entries = await prisma.ledgerEntry.findMany({
      where: {
        ledger: { type: "BOOKING_PAYMENT" }, // filter via relation
        createdAt: { gte: fromDate, lte: toDate },
      },
      include: { booking: true }, // include booking if relation exists
      orderBy: { createdAt: "desc" },
    });

    const report: any[] = [];

    for (const e of entries) {
      try {
        const booking = e.booking ?? null;
        let matched = null;

        if (booking?.providerTxId) {
          matched = await prisma.paymentCallback.findFirst({
            where: { providerTxId: booking.providerTxId },
          });
        }

        if (!matched && booking?.id) {
          try {
            matched = await prisma.paymentCallback.findFirst({
              where: { rawPayload: { path: ["bookingId"], equals: booking.id } },
            });
          } catch {
            // ignore older prisma/rawPayload failures
          }
        }

        if (!matched) {
          const windowMs = 5 * 60 * 1000; // 5 mins
          matched = await prisma.paymentCallback.findFirst({
            where: {
              createdAt: {
                gte: new Date(e.createdAt.getTime() - windowMs),
                lte: new Date(e.createdAt.getTime() + windowMs),
              },
            },
            orderBy: { createdAt: "asc" },
          });
        }

        if (matched) {
          await prisma.outboxEvent.create({
            data: {
              aggregateType: "Reconciliation",
              aggregateId: e.id,
              type: "LedgerReconciled",
              payload: JSON.stringify({ ledgerEntryId: e.id, paymentCallbackId: matched.id }),
              channel: "pubsub",
              status: "READY",
            },
          });

          report.push({ ledgerEntryId: e.id, matched: true, paymentCallbackId: matched.id });
        } else {
          report.push({ ledgerEntryId: e.id, matched: false });
        }
      } catch (err: any) {
        report.push({ ledgerEntryId: e.id, error: String(err) });
      }
    }

    return { from: fromDate.toISOString(), to: toDate.toISOString(), total: entries.length, report };
  },

  async findUnreconciled({ limit = 100 }: { limit?: number }) {
    const entries = await prisma.ledgerEntry.findMany({
      where: { ledger: { type: "BOOKING_PAYMENT" } },
      include: { booking: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return entries.map((e) => {
      const booking = e.booking ?? null;
      return {
        ledgerEntryId: e.id,
        createdAt: e.createdAt,
        bookingId: booking?.id ?? null,
        bookingProviderTxId: booking?.providerTxId ?? null,
      };
    });
  },
};
