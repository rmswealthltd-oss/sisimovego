// apps/api/src/worker/cron/cron.tasks.ts

import { logger } from "../../lib/logger";
import prisma from "../../db";

// Import task-specific scripts
import { autoCompleteTrips } from "./autoCompleteTrips";
import { nightlyFraudEmail } from "./nightlyFraudEmail";
import { settlementDaily } from "./settlementDaily";

export class CronTasks {
  private static tasksStarted = false;

  /**
   * Start scheduled cron jobs
   */
  static startAll() {
    if (this.tasksStarted) return;
    this.tasksStarted = true;

    logger.info("[CRON] Starting scheduled jobs...");

    // 1️⃣ Auto-complete stale trips every 5 minutes
    setInterval(async () => {
      try {
        await autoCompleteTrips();
      } catch (err: any) {
        logger.error(`[CRON autoCompleteTrips] ${err?.message}`);
      }
    }, 5 * 60 * 1000);

    // 2️⃣ Nightly fraud email summary @ 23:59
    this.runDailyAt("23:59", async () => {
      try {
        await nightlyFraudEmail();
      } catch (err: any) {
        logger.error(`[CRON nightlyFraudEmail] ${err?.message}`);
      }
    });

    // 3️⃣ Daily settlements @ 02:00
    this.runDailyAt("02:00", async () => {
      try {
        await settlementDaily();
      } catch (err: any) {
        logger.error(`[CRON settlementDaily] ${err?.message}`);
      }
    });

    // 4️⃣ Periodic cleanup of old outbox + dead letters (every hour)
    setInterval(async () => {
      try {
        await this.cleanupOldRecords();
      } catch (err: any) {
        logger.error(`[CRON cleanup] ${err?.message}`);
      }
    }, 60 * 60 * 1000);

    logger.info("[CRON] All jobs started");
  }

  /**
   * Run a task every day at a specific time — "HH:MM"
   */
  private static runDailyAt(time: string, task: () => Promise<void>) {
    const [hour, minute] = time.split(":").map((s) => parseInt(s));

    const check = async () => {
      const now = new Date();
      if (now.getHours() === hour && now.getMinutes() === minute) {
        logger.info(`[CRON] Running daily task @ ${time}`);
        await task();
      }
    };

    // Check every 30 seconds
    setInterval(check, 30 * 1000);
  }

  /**
   * Cleanup old records (Outbox, DLQ)
   */
  private static async cleanupOldRecords() {
    logger.info("[CRON] Running cleanupOldRecords()");

    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days

    const deletedOutbox = await prisma.outboxEvent.deleteMany({
      where: {
        processed: true,
        createdAt: { lt: cutoff },
      },
    });

    const deletedDLQ = await prisma.deadLetter.deleteMany({
      where: {
        createdAt: { lt: cutoff },
      },
    });

    logger.info(
      `[CRON CLEANUP] Removed ${deletedOutbox.count} old outbox events, ${deletedDLQ.count} DLQ entries`
    );
  }
}
