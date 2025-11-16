// src/redis.ts
import { env } from "./env";
import { Redis } from "ioredis";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 5,
  enableReadyCheck: true
});

redis.on("connect", () => console.log("[redis] connected"));
redis.on("error", (err) => console.error("[redis] error", err));

export function getRedis() {
  return redis;
}
