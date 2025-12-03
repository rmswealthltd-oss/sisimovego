// apps/api/src/worker/cron/cron.tasks.ts

import { logger } from "../../lib/logger";
import prisma from "../../db";

// Task scripts
import { autoCompleteTrips } from "./autoCompleteTrips";
import { nightlyFraudEmail } from "./nightlyFraudEmail";
import { settlementDaily } from "./settlementDaily";

export class CronTasks {
  private static started = false;

  /**
   * Start all cron jobs
   */
  static startAll() {
    if (this.started) return;
    this.started = true;

    logger.info("[CRON] Initializing scheduled tasks...");

    // 1️⃣ Auto-complete stale trips — every 5 minutes
    setInterval(async () => {
      try {
        await autoCompleteTrips();
      } catch (err: any) {
        logger.error(`[CRON autoCompleteTrips] ${err.message}`);
      }
    }, 5 * 60 * 1000);

    // 2️⃣ Nightly fraud report — 23:59
    this.runDailyAt("23:59", nightlyFraudEmail, "nightlyFraudEmail");

    // 3️⃣ Payout settlement batch — 02:00
    this.runDailyAt("02:00", settlementDaily, "settlementDaily");

    // 4️⃣ Cleanup outbox + DLQ — hourly
    setInterval(async () => {
      try {
        await this.cleanupOldRecords();
      } catch (err: any) {
        logger.error(`[CRON cleanupOldRecords] ${err.message}`);
      }
    }, 60 * 60 * 1000);

    logger.info("[CRON] All scheduled tasks started");
  }

  /**
   * Runs a given function once per day at "HH:MM"
   */
  private static runDailyAt(
    time: string,
    taskFn: () => Promise<any>,
    label: string
  ) {
    const [hour, minute] = time.split(":").map((n) => parseInt(n, 10));

    const checker = async () => {
      const now = new Date();
      if (now.getHours() === hour && now.getMinutes() === minute) {
        logger.info(`[CRON] Running daily task '${label}' @ ${time}`);
        try {
          await taskFn();
        } catch (err: any) {
          logger.error(`[CRON ${label}] ${err.message}`);
        }
      }
    };

    // Check every 30s
    setInterval(checker, 30 * 1000);
  }

  /**
   * Deletes old Outbox + DLQ records according to Prisma schema
   */
  private static async cleanupOldRecords() {
    logger.info("[CRON] Running cleanupOldRecords()");
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const outbox = await prisma.outboxEvent.deleteMany({
      where: {
        processed: true,
        createdAt: { lt: cutoff },
      },
    });

    const dead = await prisma.deadLetter.deleteMany({
      where: {
        createdAt: { lt: cutoff },
      },
    });

    logger.info(
      `[CRON CLEANUP] Deleted ${outbox.count} outbox events, ${dead.count} dead letters`
    );
  }
}
