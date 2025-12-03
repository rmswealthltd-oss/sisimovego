// src/worker/queues/payouts.queue.ts
import prisma from "../../db";

/**
 * Enqueue a payout into the Outbox to be processed by processPayoutJob.
 *
 * job.data must contain:
 *  - payoutId: string
 *  - phone: string
 *  - amount: number
 */
export async function enqueuePayout(params: {
  payoutId: string;
  phone: string;
  amount: number;
}) {
  const { payoutId, phone, amount } = params;

  // Basic validation to prevent invalid outbox rows
  if (!payoutId || typeof payoutId !== "string") {
    throw new Error("invalid_payoutId");
  }

  if (!phone || typeof phone !== "string") {
    throw new Error("invalid_phone");
  }

  if (typeof amount !== "number" || amount <= 0) {
    throw new Error("invalid_amount");
  }

  return prisma.outboxEvent.create({
    data: {
      aggregateType: "Payout",
      aggregateId: payoutId,
      type: "PayoutRequested",
      payload: JSON.stringify({ payoutId, phone, amount }),
      channel: "worker",
      status: "READY",
    },
  });
}
