// src/server.ts
import http from "http";
import { createApp } from "./app";
import { initSocket } from "./socket";
import { env } from "./env";
import { startOutboxRunner } from "./worker/outbox/outbox.runner";
import { startCronTasks } from "./worker/cron/cron.queue";

async function main() {
  const app = createApp();
  const server = http.createServer(app);

  // ------------------------------
  // SOCKET.IO INITIALIZATION
  // ------------------------------
  initSocket(server);

  // ------------------------------
  // OUTBOX → DISPATCHER WORKER
  // (push notifications, emails, SMS, events)
  // ------------------------------
  startOutboxRunner();

  // ------------------------------
  // CRON TASKS
  // auto-complete trips, nightly cleanup, settlement etc.
  // ------------------------------
  startCronTasks();

  // ------------------------------
  // START SERVER
  // ------------------------------
  server.listen(env.PORT, () => {
    console.log(`🚀 API running on port ${env.PORT}`);
  });

  // ------------------------------
  // GRACEFUL SHUTDOWN
  // ------------------------------
  const shutdown = async () => {
    console.log("\n🔻 Shutting down API...");
    server.close(() => {
      console.log("🔌 HTTP server closed.");
      process.exit(0);
    });

    // If after 5 sec still open → force exit
    setTimeout(() => process.exit(1), 5000).unref();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("❌ Fatal startup error:", err);
  process.exit(1);
});
