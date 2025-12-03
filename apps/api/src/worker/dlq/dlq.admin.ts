// src/worker/dlq/dlq.admin.ts
import prisma from "../../db";

/**
 * Reprocess a DLQ entry by pushing a new OutboxEvent.
 */
export async function adminReprocessDLQ(dlqId: string) {
  const row = await prisma.deadLetter.findUnique({
    where: { id: dlqId },
  });

  if (!row) throw new Error("dlq_not_found");

  await prisma.outboxEvent.create({
    data: {
      aggregateType: "DLQRetry",
      aggregateId: dlqId,
      type: "DLQRetry",
      channel: "worker",
      status: "READY",

      // JSON field — MUST NOT be string
      payload: {
        dlqId,
        originalPayload: row.payload,
      },
    },
  });

  return { ok: true };
}
