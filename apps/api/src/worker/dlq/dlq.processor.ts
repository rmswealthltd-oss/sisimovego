// src/worker/dlq/dlq.processor.ts
import prisma from "../../db";

/**
 * Simple DLQ processor for manual reprocessing. It will attempt to re-run the payload depending on source.
 * This is admin-operated (manual), not automatic.
 */
export async function reprocessDLQ(dlqId: string) {
  const row = await prisma.dlq.findUnique({ where: { id: dlqId } });
  if (!row) throw new Error("dlq_not_found");

  // naive reprocess: create an outbox row for the original aggregate
  await prisma.outbox.create({
    data: {
      aggregateType: "DLQRetry",
      aggregateId: row.id,
      type: "DLQRetry",
      payload: JSON.stringify({ dlqId: row.id, source: row.source, payload: row.payload }),
      channel: "worker",
      status: "READY"
    }
  });

  return { ok: true, dlqId: row.id };
}
