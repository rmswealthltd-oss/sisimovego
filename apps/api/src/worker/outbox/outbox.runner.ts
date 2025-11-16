// apps/api/src/worker/outbox/outbox.runner.ts

import { runOutboxPoller } from "./outbox.poller";
import { logger } from "../../lib/logger";

export function startOutboxRunner() {
  logger.info("[OUTBOX] Worker starting...");
  runOutboxPoller(2000); // no await — forever loop
}
