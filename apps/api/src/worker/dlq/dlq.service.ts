// apps/api/src/worker/dlq/dlq.service.ts
import prisma from "../../db";
import { logger } from "../../lib/logger";

export class DLQService {
  /**
   * Move a failed outbox event into DLQ for later inspection.
   */
  static async sendToDLQ(event: any, errorMessage: string) {
    try {
      await prisma.deadLetter.create({
        data: {
          source: event.type ?? "unknown",
          payload: event.payload, // JSON column
          error: errorMessage ?? "Unknown error",
        },
      });

      logger.warn(
        `[DLQ] Event moved to DeadLetter: ${event.id} (type=${event.type})`
      );
    } catch (err: any) {
      logger.error(`[DLQ ERROR] Failed to store DLQ record: ${err.message}`);
    }
  }

  /**
   * Requeue a DLQ entry back into the Outbox for retry.
   */
  static async requeue(dlqId: string) {
    const dlq = await prisma.deadLetter.findUnique({
      where: { id: dlqId },
    });

    if (!dlq) throw new Error("DLQ entry not found");

    await prisma.outboxEvent.create({
      data: {
        aggregateType: "DLQRetry",
        type: dlq.source ?? "unknown",
        payload: {
          dlqId: dlq.id,
          original: dlq.payload,
        },
        channel: "dlq",
        status: "READY",
      },
    });

    await prisma.deadLetter.delete({
      where: { id: dlqId },
    });

    logger.info(`[DLQ] Requeued DeadLetter event: ${dlqId}`);
  }
}
