// src/worker/queues/payouts.queue.ts
import prisma from "../../db";

export async function enqueuePayout({ payoutId, phone, amount }: { payoutId: string; phone: string; amount: number }) {
  return prisma.outbox.create({
    data: {
      aggregateType: "Payout",
      aggregateId: payoutId,
      type: "PayoutRequested",
      payload: JSON.stringify({ payoutId, phone, amount }),
      channel: "worker",
      status: "READY"
    }
  });
}
