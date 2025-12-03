// src/lib/outbox/outbox.service.ts

import prisma from "../../db";
import { logger } from "../../lib/logger";
import { processOutboxEvent } from "../../worker/processors";

export class OutboxService {
  /**
   * Emit a new outbox event
   */
  static async emit(params: {
    type: string;
    aggregateType?: string;
    aggregateId?: string;
    payload: any;
    channel?: string;
  }) {
    const { type, aggregateType, aggregateId, payload, channel } = params;

    const outbox = await prisma.outboxEvent.create({
      data: {
        type,
        aggregateType: aggregateType ?? null,
        aggregateId: aggregateId ?? null,
        payload: JSON.stringify(payload ?? {}),
        channel: channel ?? "worker",
        status: "READY",
      },
    });

    logger.info(
      `[OUTBOX] Event created: ${outbox.id} type=${type} agg=${aggregateType}`
    );

    return outbox;
  }

  /**
   * Mark outbox event as processed
   */
  static async markProcessed(id: string) {
    await prisma.outboxEvent.update({
      where: { id },
      data: {
        processed: true,
        status: "PROCESSED",
      },
    });
  }

  /**
   * Mark outbox event as failed
   */
  static async fail(id: string, errorMsg: string) {
    await prisma.outboxEvent.update({
      where: { id },
      data: {
        status: "FAILED",
        attempts: { increment: 1 },
        lastError: errorMsg,
      },
    });
  }
}

/**
 * Runs one batch of outbox events
 */
export async function runOutboxOnce(batchSize = 10) {
  const events = await prisma.outboxEvent.findMany({
    where: { status: "READY" },
    take: batchSize,
    orderBy: { createdAt: "asc" },
  });

  if (events.length === 0) {
    return 0;
  }

  for (const evt of events) {
    try {
      await processOutboxEvent(evt);

      await prisma.outboxEvent.update({
        where: { id: evt.id },
        data: {
          processed: true,
          status: "PROCESSED",
        },
      });
    } catch (err: any) {
      await prisma.outboxEvent.update({
        where: { id: evt.id },
        data: {
          status: "FAILED",
          attempts: { increment: 1 },
          lastError: err?.message ?? "Unknown error",
        },
      });
    }
  }

  return events.length;
}
