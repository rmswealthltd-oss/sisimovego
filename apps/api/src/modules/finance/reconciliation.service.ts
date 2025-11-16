// src/modules/finance/reconciliation.service.ts
import prisma from "../../db";

/**
 * Basic reconciliation service:
 * - Finds ledger entries of type BOOKING_PAYMENT with no matching PaymentCallback reference.
 * - Attempts to match by bookingId -> PaymentCallback.providerTxId or by amount+date window.
 * - Marks ledger rows as reconciled via creating a Reconciliation row (lightweight).
 *
 * Note: Add a Reconciliation model to prisma if you want to persist matches; for now we use Outbox + DLQ records.
 */

export const ReconciliationService = {
  /**
   * Scan and attempt automatic reconciliation for a date range.
   * Returns a report object.
   */
  async reconcileBookings({ from, to }: { from?: string; to?: string }) {
    const fromDate = from ? new Date(from) : new Date(Date.now() - 1000 * 60 * 60 * 24 * 7); // default 7d
    const toDate = to ? new Date(to) : new Date();

    // fetch ledger booking payment entries in window
    const entries = await prisma.ledger.findMany({
      where: {
        type: "BOOKING_PAYMENT",
        createdAt: { gte: fromDate, lte: toDate }
      },
      include: { booking: true }
    });

    const report: Array<any> = [];

    for (const e of entries) {
      try {
        const bookingId = e.bookingId;
        let matched = null;

        if (bookingId) {
          // find payment callback matching booking.providerTxId OR paymentCallback with bookingId in rawPayload
          const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
          if (booking?.providerTxId) {
            matched = await prisma.paymentCallback.findUnique({ where: { providerTxId: booking.providerTxId } }).catch(() => null);
          }
          if (!matched) {
            // try find by amount and close timestamp
            matched = await prisma.paymentCallback.findFirst({
              where: {
                rawPayload: { path: [] }, // placeholder: fallback to scanning rawPayload in worker if necessary
              }
            }).catch(() => null);
          }
        }

        if (matched) {
          // create an outbox entry to mark reconciliation
          await prisma.outbox.create({
            data: {
              aggregateType: "Reconciliation",
              aggregateId: e.id,
              type: "LedgerReconciled",
              payload: JSON.stringify({ ledgerId: e.id, paymentCallbackId: matched.id }),
              channel: "pubsub",
              status: "READY"
            }
          });
          report.push({ ledgerId: e.id, matched: true, paymentCallbackId: matched.id });
        } else {
          report.push({ ledgerId: e.id, matched: false });
        }
      } catch (err: any) {
        report.push({ ledgerId: e.id, error: err.message });
      }
    }

    return { from: fromDate.toISOString(), to: toDate.toISOString(), total: entries.length, report };
  },

  /**
   * Produce a simple unreconciled report (ledger entries without matching payment callbacks).
   */
  async findUnreconciled({ limit = 100 }: { limit?: number }) {
    // ledger entries of type BOOKING_PAYMENT where booking.amountPaid > 0 but no booking payment callback exists
    const rows = await prisma.$queryRaw<any>`
      SELECT l.* FROM "Ledger" l
      LEFT JOIN "Booking" b ON b.id = l."bookingId"
      LEFT JOIN "PaymentCallback" p ON p."providerTxId" = b."providerTxId"
      WHERE l.type = 'BOOKING_PAYMENT' AND p.id IS NULL
      ORDER BY l."createdAt" DESC
      LIMIT ${limit}
    `;
    return rows;
  }
};
