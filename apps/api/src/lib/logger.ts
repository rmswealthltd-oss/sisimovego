// apps/api/src/lib/logger.ts

import pino from "pino";

const isProd =
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "prod";

let logger: pino.Logger;

if (isProd) {
  // Production: JSON logs (fast, parsable, compatible with GCP/AWS/Loki)
  logger = pino({
    level: "info",
    base: {
      env: process.env.NODE_ENV,
      service: "sisimove-api",
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
} else {
  // Development: pretty output
  logger = pino({
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  });
}

export function withRequestId(requestId: string) {
  return logger.child({ requestId });
}

export { logger };
