// apps/api/src/worker/index.ts

import { runOutboxLoop } from "../outbox/outbox.runner";

const PARALLEL_LOOPS = Number(process.env.WORKER_LOOPS ?? 2);
const BATCH_SIZE = Number(process.env.WORKER_BATCH_SIZE ?? 10);
const INTERVAL_MS = Number(process.env.WORKER_INTERVAL_MS ?? 1000);

let stopping = false;

async function startWorkerLoop(id: number) {
  console.log(`[worker] loop ${id} starting`);

  while (!stopping) {
    try {
      // Run a *single poll* cycle (pollOnce)
      await runOutboxLoop({
        batchSize: BATCH_SIZE,
        intervalMs: INTERVAL_MS,
      });

      // Add a delay between cycles
      await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));
    } catch (err: any) {
      console.error(`[worker] loop ${id} error:`, err);
      // Avoid a tight crash loop
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log(`[worker] loop ${id} stopped`);
}

async function main() {
  console.log(`[worker] starting with ${PARALLEL_LOOPS} parallel loops`);

  for (let i = 0; i < PARALLEL_LOOPS; i++) {
    startWorkerLoop(i).catch((err) => {
      console.error(`[worker] loop ${i} crashed`, err);
    });
  }
}

process.on("SIGINT", () => {
  console.log("[worker] stopping (SIGINT)...");
  stopping = true;
});

process.on("SIGTERM", () => {
  console.log("[worker] stopping (SIGTERM)...");
  stopping = true;
});

main().catch((err) => {
  console.error("[worker] fatal error:", err);
  process.exit(1);
});
