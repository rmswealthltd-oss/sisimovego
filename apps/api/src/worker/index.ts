// src/worker/index.ts
import { setTimeout } from "timers/promises";
import { runOutboxOnce } from "./outbox/outbox.service";
import { env } from "../env";

let stopping = false;

async function main() {
  console.log("Worker starting...");

  while (!stopping) {
    try {
      const processed = await runOutboxOnce(); // optionally pass batchSize
      console.log(`[OUTBOX] Processed ${processed} events`);
    } catch (e) {
      console.error("Outbox run error", e);
    }

    // poll interval (2 seconds)
    await setTimeout(2000);
  }

  console.log("Worker stopped gracefully.");
}

// stop on SIGINT/SIGTERM
process.on("SIGINT", () => { stopping = true; });
process.on("SIGTERM", () => { stopping = true; });

main().catch((err) => {
  console.error("Worker failed", err);
  process.exit(1);
});
