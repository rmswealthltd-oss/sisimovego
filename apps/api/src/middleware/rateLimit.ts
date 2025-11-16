// src/middleware/rateLimit.ts
import { Request, Response, NextFunction } from "express";

/**
 * Simple in-memory rate limiter.
 * For production use a distributed store (Redis) to share state across instances.
 */

const WINDOW_MS = 60 * 1000; // 1 minute window
const LIMIT = 120;

interface Entry { ts: number; count: number; }

const map = new Map<string, Entry>();

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip || (req.headers["x-forwarded-for"] as string) || "anon";
  const now = Date.now();
  const entry = map.get(key);

  if (!entry || now - entry.ts > WINDOW_MS) {
    map.set(key, { ts: now, count: 1 });
    return next();
  }

  entry.count++;
  if (entry.count > LIMIT) {
    res.status(429).json({ error: "rate_limited", retryAfterSec: Math.ceil((WINDOW_MS - (now - entry.ts)) / 1000) });
    return;
  }

  map.set(key, entry);
  next();
}
