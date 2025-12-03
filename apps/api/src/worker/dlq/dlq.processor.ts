// src/worker/dlq/dlq.processor.ts
import prisma from "../../db";

/**
 * Reprocess a DLQ entry by pushing the payload back into the Outbox.
 * Manual admin-triggered task.
 */
export async function reprocessDLQ(dlqId: string) {
  const row = await prisma.deadLetter.findUnique({
    where: { id: dlqId },
  });

  if (!row) throw new Error("dlq_not_found");

  await prisma.outboxEvent.create({
    data: {
      aggregateType: "DLQRetry",
      aggregateId: row.id,
      type: "DLQRetry",
      channel: "worker",
      status: "READY",

      // JSON field — must be plain JS object, not a string
      payload: {
        dlqId: row.id,
        source: row.source,
        originalPayload: row.payload, // keep original JSON clean
      },
    },
  });

  return { ok: true, dlqId: row.id };
}
