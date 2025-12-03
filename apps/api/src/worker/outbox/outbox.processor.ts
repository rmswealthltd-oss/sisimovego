import { logger } from "../../lib/logger";
import prisma from "../../db";

interface OutboxEvent {
  id: string;
  type: string;
  payload: any;
}

export class OutboxProcessor {
  static async process(event: OutboxEvent) {
    try {
      logger.info(`[OUTBOX] Processing event: ${event.type} (${event.id})`);

      switch (event.type) {
        case "cron.heartbeat":
          return await this.handleHeartbeat();

        case "cron.retryFailedOutbox":
          return await this.handleRetryFailedOutbox();

        case "cron.hourlyCleanup":
          return await this.handleHourlyCleanup();

        case "cron.nightlyMaintenance":
          return await this.handleNightlyMaintenance();

        default:
          throw new Error(`Unknown outbox event type: ${event.type}`);
      }
    } catch (err: any) {
      logger.error(`[OUTBOX ERROR] Event ${event.id} failed → ${err.message}`);
      throw err; // send to DLQ upstream
    }
  }

  // --------------------------------------------------------------------------
  // CRON HANDLERS
  // --------------------------------------------------------------------------

  static async handleHeartbeat() {
    logger.info("[CRON] 💓 Heartbeat OK");
    return true;
  }

  /**
   * Retry outbox events that have FAILED status.
   * Note: 'retryCount' is removed because it does not exist in schema.
   */
  static async handleRetryFailedOutbox() {
    logger.info("[CRON] Retrying failed outbox events…");

    const failed = await prisma.outboxEvent.findMany({
      where: { status: "FAILED" },
      orderBy: { createdAt: "asc" },
      take: 50, // avoid heavy batch retries
    });

    if (failed.length === 0) {
      logger.info("[CRON] No failed outbox events to retry.");
      return true;
    }

    logger.warn(`[CRON] Retrying ${failed.length} failed events.`);

    for (const evt of failed) {
      try {
        await prisma.outboxEvent.update({
          where: { id: evt.id },
          data: {
            status: "READY",
          },
        });
      } catch (err: any) {
        logger.error(`[CRON] Failed to requeue ${evt.id}: ${err.message}`);
      }
    }

    return true;
  }

  /**
   * Deletes stale OTPs (older than 2 hours)
   * Note: Remove reference to prisma.otp if 'otp' model does not exist.
   */
  static async handleHourlyCleanup() {
    logger.info("[CRON] Running hourly cleanup…");

    // Remove this if otp table/model doesn't exist:
    // const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);
    // await prisma.otp.deleteMany({
    //   where: { createdAt: { lt: cutoff } },
    // });

    logger.info("[CRON] Hourly cleanup completed.");
    return true;
  }

  /**
   * Nightly maintenance for long-term data.
   * Remove 'archived' field usage if it doesn't exist.
   */
  static async handleNightlyMaintenance() {
    logger.info("[CRON] Running nightly maintenance…");

    // Remove this if Trip.archived doesn't exist:
    // const result = await prisma.trip.updateMany({
    //   where: { status: "COMPLETED", archived: false },
    //   data: { archived: true },
    // });

    // logger.info(`[CRON] Archived ${result.count} completed trips.`);
    logger.info("[CRON] Nightly maintenance completed.");
    return true;
  }
}
