// src/redis.ts
import { env } from "./env";
import { Redis } from "ioredis";

/**
 * If no REDIS_URL is provided, disable redis gracefully.
 */
if (!env.REDIS_URL) {
  console.warn("[redis] REDIS_URL not set → Redis disabled");
}

export const redis = env.REDIS_URL
  ? new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 5,
      enableReadyCheck: true,
      retryStrategy(times) {
        // Exponential backoff: 0.5s → 1s → 2s → 4s → etc.
        const delay = Math.min(times * 500, 8000);
        console.warn(`[redis] retrying in ${delay}ms`);
        return delay;
      },
    })
  : null;

/**
 * Event listeners (only if redis is enabled)
 */
if (redis) {
  redis.on("connect", () => console.log("[redis] connected"));
  redis.on("ready", () => console.log("[redis] ready"));
  redis.on("error", (err) => console.error("[redis] error", err));
  redis.on("end", () => console.warn("[redis] connection closed"));
}

/**
 * Getter for Redis instance
 */
export function getRedis() {
  return redis;
}
