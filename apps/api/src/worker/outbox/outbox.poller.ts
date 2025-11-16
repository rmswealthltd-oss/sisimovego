import prisma from "../../db";
import { logger } from "../../lib/logger";
import { OutboxProcessor } from "./outbox.processor";
import { DLQService } from "../dlq/dlq.service";

export class OutboxPoller {
  private static intervalMs = 2000;

  static start() {
    logger.info(`[OUTBOX] Poller started (interval=${this.intervalMs}ms)`);

    setInterval(async () => {
      try {
        const events = await prisma.outboxEvent.findMany({
          where: { processed: false },
          orderBy: { createdAt: "asc" },
          take: 10,
        });

        if (events.length === 0) return;

        logger.info(`[OUTBOX] Processing ${events.length} events`);

        for (const evt of events) {
          try {
            await OutboxProcessor.process(evt);

            await prisma.outboxEvent.update({
              where: { id: evt.id },
              data: { processed: true },
            });
          } catch (err: any) {
            logger.error(`[OUTBOX ERROR] Event ${evt.id} failed: ${err.message}`);
            await DLQService.sendToDLQ(evt, err.message);
          }
        }
      } catch (err: any) {
        logger.error(`[OUTBOX POLLER ERROR] ${err.message}`);
      }
    }, this.intervalMs);
  }
}

// THIS is what server.ts and outbox.runner.ts will call
export function runOutboxPoller() {
  OutboxPoller.start();
}
