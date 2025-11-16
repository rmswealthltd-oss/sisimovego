// src/worker/cron/index.ts
import { autoCompleteTrips } from "./autoCompleteTrips";
import { nightlyFraudEmail } from "./nightlyFraudEmail";
import { settlementDaily } from "./settlementDaily";

/**
 * startCronTasks: run light scheduled tasks in process.
 * For production prefer a scheduler (Kubernetes CronJob) or a dedicated cron worker.
 */
export function startCronTasks() {
  // simple in-process schedule
  setInterval(() => {
    // hourly tasks
    autoCompleteTrips().catch((e) => console.error("cron:autoCompleteTrips", e));
  }, 1000 * 60 * 60); // every hour

  setInterval(() => {
    nightlyFraudEmail().catch((e) => console.error("cron:nightlyFraudEmail", e));
  }, 1000 * 60 * 60 * 24); // daily

  setInterval(() => {
    settlementDaily().catch((e) => console.error("cron:settlementDaily", e));
  }, 1000 * 60 * 60 * 24); // daily
}
