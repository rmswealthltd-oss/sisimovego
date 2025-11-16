// apps/api/src/worker/outbox/outbox.service.ts

import prisma from "../../db";
import { logger } from "../../lib/logger";

export class OutboxService {
  /**
   * Emit a single event
   */
  static async emit(type: string, payload: unknown) {
    try {
      const evt = await prisma.outboxEvent.create({
        data: { type, payload },
      });

      logger.info(`[OUTBOX] Event queued: ${type} (${evt.id})`);
      return evt;
    } catch (err: any) {
      logger.error(`[OUTBOX ERROR] emit() failed: ${err.message}`);
      throw err;
    }
  }

  /**
   * Emit multiple events in a single transaction
   */
  static async emitMany(events: Array<{ type: string; payload: unknown }>) {
    try {
      return await prisma.$transaction(
        events.map((e) =>
          prisma.outboxEvent.create({
            data: { type: e.type, payload: e.payload },
          })
        )
      );
    } catch (err: any) {
      logger.error(`[OUTBOX ERROR] emitMany() failed: ${err.message}`);
      throw err;
    }
  }
}
