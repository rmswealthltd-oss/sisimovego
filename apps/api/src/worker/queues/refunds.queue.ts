// src/worker/queues/refunds.queue.ts
import prisma from "../../db";

/**
 * Enqueue a refund job by creating an Outbox row.
 */
export async function enqueueRefund({ refundId, bookingId, amountCents, phone }: { refundId: string; bookingId?: string; amountCents: number; phone?: string }) {
  return prisma.outboxEvent.create({
    data: {
      aggregateType: "Refund",
      aggregateId: refundId,
      type: "RefundRequested",
      payload: JSON.stringify({ refundId, bookingId, amount: amountCents, phone }),
      channel: "worker",
      status: "READY"
    }
  });
}
