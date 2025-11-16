// apps/api/src/worker/outbox/outbox.processor.ts

import { logger } from "../../lib/logger";
import prisma from "../../db";

export class OutboxProcessor {
  static async process(event: any) {
    try {
      logger.info(`[OUTBOX] Processing event: ${event.type}`);

      switch (event.type) {
        //
        // ===========================
        // 🚀 CRON EVENT HANDLERS
        // ===========================
        //
        case "cron.heartbeat":
          return await this.handleHeartbeat(event);

        case "cron.retryFailedOutbox":
          return await this.handleRetryOutbox(event);

        case "cron.hourlyCleanup":
          return await this.handleHourlyCleanup(event);

        case "cron.nightlyMaintenance":
          return await this.handleNightlyMaintenance(event);

        //
        // ===========================
        // Add your other event types here…
        // ===========================
        //

        default:
          throw new Error(`Unknown outbox event type: ${event.type}`);
      }
    } catch (err: any) {
      logger.error(`[OUTBOX ERROR] Event ${event.id} failed: ${err.message}`);
      throw err;
    }
  }

  // --------------------------------------------------------------------------
  // CRON HANDLERS
  // --------------------------------------------------------------------------

  static async handleHeartbeat(event: any) {
    logger.info("[CRON] 💓 Heartbeat OK");
    return true;
  }

  static async handleRetryOutbox(event: any) {
    logger.info("[CRON] Retrying failed outbox events...");

    const failed = await prisma.outboxEvent.findMany({
      where: { processed: false },
    });

    logger.info(`[CRON] Found ${failed.length} failed events.`);

    return true;
  }

  static async handleHourlyCleanup(event: any) {
    logger.info("[CRON] Running hourly cleanup…");

    // Example: delete stale OTP codes older than 2 hours
    await prisma.oTP.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      },
    });

    return true;
  }

  static async handleNightlyMaintenance(event: any) {
    logger.info("[CRON] Running nightly maintenance…");

    // Example: Archive old trips
    await prisma.trip.updateMany({
      where: { status: "COMPLETED" },
      data: { archived: true },
    });

    return true;
  }
}
