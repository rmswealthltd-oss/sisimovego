// apps/api/src/worker/cron/cron.queue.ts

import prisma from "../../db";
import cron from "node-cron";
import { logger } from "../../lib/logger";

/**
 * Push a cron job into the Outbox queue.
 * Standardized to match Prisma OutboxEvent schema.
 */
export async function enqueueCronTask(taskName: string, payload: any = {}) {
  return prisma.outboxEvent.create({
    data: {
      aggregateType: "Cron",
      aggregateId: taskName,
      type: `cron.${taskName}`,
      payload: JSON.stringify(payload),
      channel: "cron",
      status: "READY",
    },
  });
}

/**
 * Wrap cron tasks with try/catch + logging.
 */
async function safeRun(task: string, fn: () => Promise<any>) {
  try {
    logger.info(`[CRON] Running: ${task}`);
    await fn();
    logger.info(`[CRON] Completed: ${task}`);
  } catch (err: any) {
    logger.error(`[CRON ERROR] ${task}: ${err?.message}`);
  }
}

/**
 * Register all cron schedules.
 */
export function startCronTasks() {
  logger.info("[CRON] Scheduler starting...");

  // Every 1 minute — heartbeat
  cron.schedule("* * * * *", () =>
    safeRun("Heartbeat", async () => {
      await enqueueCronTask("heartbeat");
    })
  );

  // Every 10 minutes — retry outbox failures
  cron.schedule("*/10 * * * *", () =>
    safeRun("RetryFailedOutbox", async () => {
      await enqueueCronTask("retryFailedOutbox");
    })
  );

  // Hourly cleanup
  cron.schedule("0 * * * *", () =>
    safeRun("HourlyCleanup", async () => {
      await enqueueCronTask("hourlyCleanup");
    })
  );

  // Nightly maintenance at 3AM
  cron.schedule("0 3 * * *", () =>
    safeRun("NightlyMaintenance", async () => {
      await enqueueCronTask("nightlyMaintenance");
    })
  );

  logger.info("[CRON] Tasks registered.");
}
