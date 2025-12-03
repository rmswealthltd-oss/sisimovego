// src/worker/cron/index.ts
import { autoCompleteTrips } from "./autoCompleteTrips";
import { nightlyFraudEmail } from "./nightlyFraudEmail";
import { settlementDaily } from "./settlementDaily";

/**
 * startCronTasks:
 * Lightweight in-process cron suitable for development.
 *
 * NOTE:
 * In production, use a real job scheduler:
 * - Kubernetes CronJob
 * - systemd timers
 * - external worker
 */
export function startCronTasks() {
  console.log("[CRON] Starting in-process cron tasks...");

  // 1️⃣ Auto-complete stale trips — every hour
  setInterval(async () => {
    try {
      await autoCompleteTrips();
    } catch (err) {
      console.error("[CRON autoCompleteTrips]", err);
    }
  }, 60 * 60 * 1000);

  // 2️⃣ Nightly fraud summary — every 24 hours
  setInterval(async () => {
    try {
      await nightlyFraudEmail();
    } catch (err) {
      console.error("[CRON nightlyFraudEmail]", err);
    }
  }, 24 * 60 * 60 * 1000);

  // 3️⃣ Daily settlement — every 24 hours
  setInterval(async () => {
    try {
      await settlementDaily();
    } catch (err) {
      console.error("[CRON settlementDaily]", err);
    }
  }, 24 * 60 * 60 * 1000);

  console.log("[CRON] All tasks scheduled.");
}
