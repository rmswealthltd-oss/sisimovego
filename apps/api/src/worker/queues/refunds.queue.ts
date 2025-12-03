// src/worker/queues/refunds.queue.ts
import prisma from "../../db";

export async function enqueueRefund({
  refundId,
  bookingId,
  amountCents,
  phone
}: {
  refundId: string;
  bookingId?: string;
  amountCents: number;
  phone?: string;
}) {
  return prisma.outboxEvent.create({
    data: {
      aggregateType: "Refund",
      aggregateId: refundId,                     // Good: Idempotent
      type: "RefundRequested",
      payload: {
        refundId,
        bookingId: bookingId ?? null,            // Better than JSON.stringify manually
        amount: amountCents,
        phone: phone ?? null
      },
      channel: "worker",                         // Matches your internal worker channel
      status: "READY",
    },
  });
}
