// apps/api/src/worker/outbox/outbox.poller.ts

import prisma from "../../db";
import { logger } from "../../lib/logger";
import { OutboxProcessor } from "./outbox.processor";
import { DLQService } from "../dlq/dlq.service";

export class OutboxPoller {
  static intervalMs = Number(process.env.WORKER_INTERVAL_MS ?? 1000);
  static batchSize = Number(process.env.WORKER_BATCH_SIZE ?? 10);

  static async pollOnce() {
    try {
      // 1. Claim batch of READY events
      const claimed = await prisma.$transaction(async (tx) => {
        // Fetch READY events sorted by createdAt
        const events = await tx.outboxEvent.findMany({
          where: { status: "READY" },
          take: this.batchSize,
          orderBy: { createdAt: "asc" },
        });

        if (events.length === 0) return [];

        // Mark them as PROCESSING atomically
        const ids = events.map((e) => e.id);

        await tx.outboxEvent.updateMany({
          where: { id: { in: ids } },
          data: { status: "PROCESSING" },
        });

        return events;
      });

      if (claimed.length === 0) return;

      logger.info(`[OUTBOX] Claimed ${claimed.length} events`);

      // 2. Process claimed events
      for (const evt of claimed) {
        try {
          await OutboxProcessor.process(evt);

          await prisma.outboxEvent.update({
            where: { id: evt.id },
            data: {
              status: "DONE",
              processed: true,
            },
          });
        } catch (err: any) {
          logger.error(`[OUTBOX ERROR] Event ${evt.id} failed: ${err.message}`);

          // Move to DLQ
          await DLQService.sendToDLQ(evt, err.message);

          // Mark failed
          await prisma.outboxEvent.update({
            where: { id: evt.id },
            data: { status: "FAILED" },
          });
        }
      }
    } catch (err: any) {
      logger.error(`[OUTBOX POLL ERROR] ${err.message}`);
    }
  }

  static start() {
    logger.info(`[OUTBOX] Poller started (interval=${this.intervalMs}ms)`);

    setInterval(async () => {
      await this.pollOnce();
    }, this.intervalMs);
  }
}

export function runOutboxPoller() {
  OutboxPoller.start();
}
