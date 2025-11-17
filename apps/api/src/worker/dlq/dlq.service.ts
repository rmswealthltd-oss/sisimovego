// apps/api/src/worker/dlq/dlq.service.ts

import prisma from "../../db";
import { logger } from "../../lib/logger";

export class DLQService {
  /**
   * Move a failed outbox event to the Dead Letter Queue.
   */
  static async sendToDLQ(event: any, errorMessage: string) {
    try {
      await prisma.deadLetter.create({
        data: {
          source: event.type,
          payload: event.payload,
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
   * Requeue an event from DLQ back into Outbox.
   */
  static async requeue(dlqId: string) {
    const dlq = await prisma.deadLetter.findUnique({
      where: { id: dlqId },
    });

    if (!dlq) throw new Error("DLQ entry not found");

    await prisma.outboxEvent.create({
      data: {
        aggregateType: "DLQ",
        aggregateId: `dlq-retry-${Date.now()}`,
        type: dlq.source,
        payload: dlq.payload,
        status: "READY"
      },
    });

    await prisma.deadLetter.delete({
      where: { id: dlqId },
    });

    logger.info(`[DLQ] Requeued DeadLetter event: ${dlqId}`);
  }
}
