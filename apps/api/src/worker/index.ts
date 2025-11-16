// src/worker/index.ts
import { setTimeout } from "timers/promises";
import { runOutboxOnce } from "./outbox/outbox.service";
import { env } from "../env";

async function main() {
  console.log("Worker starting...");
  while (true) {
    try {
      await runOutboxOnce();
    } catch (e) {
      console.error("Outbox run error", e);
    }
    // poll interval
    await setTimeout(2000);
  }
}

main().catch((err) => {
  console.error("Worker failed", err);
  process.exit(1);
});
