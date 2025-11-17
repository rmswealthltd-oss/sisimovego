// src/worker/index.ts
import { runOutboxLoop } from "../outbox/outbox.runner";
import { env } from "./env";

const PARALLEL_LOOPS = Number(process.env.WORKER_LOOPS ?? 2);
const BATCH_SIZE = Number(process.env.WORKER_BATCH_SIZE ?? 10);
const INTERVAL_MS = Number(process.env.WORKER_INTERVAL_MS ?? 1000);

const loops: Promise<void>[] = [];
let stopping = false;

async function startLoop(id: number) {
  console.log(`worker loop ${id} starting`);
  while (!stopping) {
    try {
      await runOutboxLoop({ batchSize: BATCH_SIZE, intervalMs: INTERVAL_MS });
      // runOutboxLoop never returns (in current impl) — we actually want a single poller instance here
      // To keep things simple we will break; each loop runs its own pollOnce cycle inside runOutboxLoop
      return;
    } catch (err: any) {
      console.error(`worker loop ${id} error`, err);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

async function main() {
  console.log("Worker main starting with", PARALLEL_LOOPS, "parallel loops");
  // Start multiple independent pollers (safe because poller uses FOR UPDATE SKIP LOCKED)
  for (let i = 0; i < PARALLEL_LOOPS; i++) {
    // Each loop runs its own continuous runner
    (async () => {
      try {
        await runOutboxLoop({ batchSize: BATCH_SIZE, intervalMs: INTERVAL_MS });
      } catch (err) {
        console.error("runOutboxLoop stopped", err);
      }
    })();
  }
}

process.on("SIGINT", () => {
  console.log("Worker stopping (SIGINT)...");
  stopping = true;
  process.exit(0);
});
process.on("SIGTERM", () => {
  console.log("Worker stopping (SIGTERM)...");
  stopping = true;
  process.exit(0);
});

main().catch((err) => {
  console.error("Worker crashed", err);
  process.exit(1);
});
