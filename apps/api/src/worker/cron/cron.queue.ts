// apps/api/src/worker/cron/cron.queue.ts

import prisma from "../../db";
import cron from "node-cron";
import { logger } from "../../lib/logger";

/**
 * Push a cron job into the Outbox queue.
 * The Outbox worker will pick it up and execute its processor.
 */
export async function enqueueCronTask(taskName: string, payload: any = {}) {
  return prisma.outboxEvent.create({
    data: {
      type: `cron.${taskName}`,
      payload,
    },
  });
}

/**
 * Wrap cron tasks with try/catch + logging.
 */
async function safeRun(task: string, fn: () => Promise<any>) {
  try {
    logger.info(`[CRON] Running task: ${task}`);
    await fn();
    logger.info(`[CRON] Completed task: ${task}`);
  } catch (err: any) {
    logger.error(`[CRON ERROR] Task "${task}" failed: ${err?.message}`);
  }
}

/**
 * Register all cron schedules.
 */
export function startCronTasks() {
  logger.info("[CRON] Scheduler starting...");

  // Every 1 minute — heartbeat
  cron.schedule("* * * * *", async () => {
    await safeRun("Heartbeat", async () => {
      await enqueueCronTask("heartbeat");
    });
  });

  // Every 10 minutes — retry outbox
  cron.schedule("*/10 * * * *", async () => {
    await safeRun("RetryFailedOutbox", async () => {
      await enqueueCronTask("retryFailedOutbox");
    });
  });

  // Every hour — cleanup
  cron.schedule("0 * * * *", async () => {
    await safeRun("HourlyCleanup", async () => {
      await enqueueCronTask("hourlyCleanup");
    });
  });

  // Nightly maintenance at 3AM
  cron.schedule("0 3 * * *", async () => {
    await safeRun("NightlyMaintenance", async () => {
      await enqueueCronTask("nightlyMaintenance");
    });
  });

  logger.info("[CRON] Tasks registered.");
}
