// src/modules/payments/refund.service.ts
import prisma from "../../db";
import crypto from "crypto";

/**
 * RefundService:
 * - Initiates refunds (creates Refund row, ledger entry, outbox event)
 * - Marks refunds as paid (ledger + outbox)
 */
export const RefundService = {
  /**
   * Initiate a refund for a booking.
   */
  async initiateRefund({
    userId,
    bookingId,
    amountCents,
    reason,
    requestedBy
  }: {
    userId: string;
    bookingId: string;
    amountCents: number;
    reason?: string;
    requestedBy?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      // --- Create refund row ---
      const refund = await tx.refund.create({
        data: {
          userId,                         // required
          bookingId,
          amount: amountCents,            // required now
          reason: reason ?? null,
          status: "PENDING"
        }
      });

      // --- Create LedgerEntry for refund request ---
      await tx.ledgerEntry.create({
        data: {
          ledgerId: crypto.randomUUID(),   // REQUIRED
          walletId: null,                  // or escrow wallet
          bookingId: bookingId,
          userId,
          amount: -amountCents,
          direction: "DEBIT",
          reference: `REFUND_REQUEST_${refund.id}`,
          note: `Refund requested for booking ${bookingId}`
        }
      });

      // --- Create outbox event for worker ---
      await tx.outboxEvent.create({
        data: {
          aggregateType: "Refund",
          aggregateId: refund.id,
          type: "RefundRequested",
          payload: JSON.stringify({
            refundId: refund.id,
            bookingId,
            userId,
            amount: amountCents
          }),
          channel: "worker",
          status: "READY"
        }
      });

      return refund;
    });
  },

  /**
   * Mark refund as paid (after external provider confirms)
   */
  async markRefundPaid(refundId: string, providerTxId?: string) {
    return prisma.$transaction(async (tx) => {
      // --- Update refund status ---
      const r = await tx.refund.update({
        where: { id: refundId },
        data: { status: "PAID" }
      });

      if (!r.amount) throw new Error("Refund amount is missing");

      // --- Create LedgerEntry for refund payout ---
      await tx.ledgerEntry.create({
        data: {
          ledgerId: crypto.randomUUID(),   // REQUIRED
          walletId: null,                  // or driver wallet
          bookingId: r.bookingId ?? undefined,
          userId: r.userId,
          amount: -r.amount,
          direction: "DEBIT",
          reference: `REFUND_PAID_${refundId}`,
          note: `Refund paid, providerTxId=${providerTxId ?? "n/a"}`
        }
      });

      // --- Outbox event for reconciliation / notification ---
      await tx.outboxEvent.create({
        data: {
          aggregateType: "Refund",
          aggregateId: refundId,
          type: "RefundPaid",
          payload: JSON.stringify({ refundId, providerTxId }),
          channel: "pubsub",
          status: "READY"
        }
      });

      return r;
    });
  }
};
