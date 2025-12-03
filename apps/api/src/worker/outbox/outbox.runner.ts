import { runOutboxOnce } from "./outbox.service";
import { logger } from "../../lib/logger";

interface OutboxLoopOptions {
  batchSize?: number;
  intervalMs?: number;
  stopping?: () => boolean; // optional callback to stop the loop
}

export async function runOutboxLoop({
  batchSize = 10,
  intervalMs = 1000,
  stopping,
}: OutboxLoopOptions = {}) {
  logger.info("[OUTBOX] Loop started");

  while (!stopping?.()) { // stop if stopping() returns true
    try {
      const processed = await runOutboxOnce(batchSize);
      logger.debug(`[OUTBOX] Processed ${processed} events`);

      await new Promise((r) => setTimeout(r, intervalMs));
    } catch (err: any) {
      logger.error("[OUTBOX] Loop error:", err);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  logger.info("[OUTBOX] Loop stopped");
}
