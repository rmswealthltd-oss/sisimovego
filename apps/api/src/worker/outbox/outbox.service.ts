// src/lib/outbox/outbox.service.ts
import prisma from "../../db";
import { logger } from "../../lib/logger";
import {processOutboxEvent} from "../worker/processors";

export class OutboxService {
  /**
   * Write a new outbox event
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
        aggregateType,
        aggregateId,
        payload,
        channel: channel ?? "worker",
      },
    });

    logger.info(
      `[OUTBOX] Event created: ${outbox.id} type=${type} aggregate=${aggregateType}`
    );

    return outbox;
  }

  /**
   * Mark as processed
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
   * Mark as failed
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
 * Runs a single batch of outbox events
 */
export async function runOutboxOnce(batchSize = 10) {
  const events = await prisma.outboxEvent.findMany({
    where: { status: "READY" },
    take: batchSize,
    orderBy: { createdAt: "asc" },
  });

  for (const event of events) {
    try {
      await processOutboxEvent(event);

      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: { status: "PROCESSED", processed: true },
      });
    } catch (err: any) {
      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: {
          status: "FAILED",
          attempts: { increment: 1 },
          lastError: err?.message ?? "Unknown error",
        },
      });
    }
  }
}
