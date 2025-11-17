// src/worker/dlq/dlq.admin.ts
import prisma from "../../db";

/**
 * Reprocess a specific DLQ entry by creating a new outbox row
 */
export async function adminReprocessDLQ(dlqId: string) {
  const row = await prisma.deadLetter.findUnique({ where: { id: dlqId } });
  if (!row) throw new Error("dlq_not_found");

  await prisma.outboxEvent.create({
    data: {
      aggregateType: "DLQRetry",
      aggregateId: dlqId,
      type: "DLQRetry",
      payload: JSON.stringify({ dlqId, payload: row.payload }),
      channel: "worker",
      status: "READY"
    }
  });

  return { ok: true };
}
