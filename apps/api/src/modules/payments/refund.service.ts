// src/modules/payments/refund.service.ts
import prisma from "../../db";

/**
 * Refund service: creates refund record, does ledger entries, and enqueues payout if needed.
 * This service does NOT automatically execute external refund (mpesa/stripe) — worker should do that.
 */

export const RefundService = {
  /**
   * Initiate a refund for a booking. This will:
   * - create Refund row (PENDING)
   * - create Ledger refund entry (negative on escrow or positive on driver depending)
   * - create Outbox event for refund processing
   */
  async initiateRefund({ bookingId, amountCents, reason, requestedBy }: { bookingId: string; amountCents: number; reason?: string; requestedBy?: string }) {
    return prisma.$transaction(async (tx) => {
      // create refund row
      const refund = await tx.refund.create({
        data: {
          bookingId,
          amount: amountCents,
          reason: reason ?? null,
          status: "PENDING"
        }
      });

      // ledger: create a refund ledger entry (this is an accounting placeholder)
      await tx.ledger.create({
        data: {
          bookingId,
          amount: -amountCents,
          type: "REFUND",
          description: `Refund requested ${refund.id} for booking ${bookingId}`
        }
      });

      // outbox event for worker to process actual external refund
      await tx.outbox.create({
        data: {
          aggregateType: "Refund",
          aggregateId: refund.id,
          type: "RefundRequested",
          payload: JSON.stringify({ refundId: refund.id, bookingId, amount: amountCents }),
          channel: "worker",
          status: "READY"
        }
      });

      return refund;
    });
  },

  /**
   * Mark refund as paid (called by refund worker after external provider returns success)
   */
  async markRefundPaid(refundId: string, providerTxId?: string) {
    return prisma.$transaction(async (tx) => {
      const r = await tx.refund.update({
        where: { id: refundId },
        data: { status: "PAID", updatedAt: new Date() }
      });

      await tx.ledger.create({
        data: {
          bookingId: r.bookingId,
          amount: -r.amount,
          type: "REFUND",
          description: `Refund paid (${refundId}) providerTxId=${providerTxId ?? "n/a"}`
        }
      });

      await tx.outbox.create({
        data: {
          aggregateType: "Refund",
          aggregateId: refundId,
          type: "RefundPaid",
          payload: JSON.stringify({ refundId }),
          channel: "pubsub",
          status: "READY"
        }
      });

      return r;
    });
  }
};
