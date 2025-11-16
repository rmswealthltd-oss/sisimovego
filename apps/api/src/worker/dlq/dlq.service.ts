// apps/api/src/worker/dlq/dlq.service.ts

import prisma from "../../db";
import { logger } from "../../lib/logger";

export class DLQService {
  /**
   * Move a failed outbox event to the Dead Letter Queue.
   */
  static async sendToDLQ(event: any, errorMessage: string) {
    try {
      await prisma.deadLetterQueue.create({
        data: {
          outboxId: event.id,
          eventType: event.type,
          payload: event.payload,
          error: errorMessage ?? "Unknown error",
        },
      });

      logger.warn(
        `[DLQ] Event moved to DLQ: ${event.id} (type=${event.type})`
      );
    } catch (err: any) {
      logger.error(`[DLQ ERROR] Failed to store DLQ record: ${err.message}`);
    }
  }

  /**
   * Requeue an event from DLQ back into Outbox.
   */
  static async requeue(dlqId: string) {
    const dlq = await prisma.deadLetterQueue.findUnique({
      where: { id: dlqId },
    });

    if (!dlq) throw new Error("DLQ entry not found");

    await prisma.outboxEvent.create({
      data: {
        aggregateType: "DLQ",
        aggregateId: `dlq-retry-${Date.now()}`,
        type: dlq.eventType,
        payload: dlq.payload,
      },
    });

    await prisma.deadLetterQueue.delete({
      where: { id: dlqId },
    });

    logger.info(`[DLQ] Requeued DLQ event: ${dlqId}`);
  }
}
