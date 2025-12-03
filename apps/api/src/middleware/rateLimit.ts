// src/middleware/rateLimit.ts
import { Request, Response, NextFunction } from "express";

/**
 * Simple in-memory rate limiter.
 *
 * ❗ For production, always use Redis / Upstash / Memcached.
 *    In-memory only works on a single server instance.
 */

const WINDOW_MS = 60 * 1000; // 1 minute window
const LIMIT = 120;           // 120 requests per IP per minute
const CLEAN_INTERVAL = 5 * 60 * 1000; // Clear unused entries every 5 minutes

interface Entry {
  ts: number;
  count: number;
}

const buckets = new Map<string, Entry>();

// Cleanup every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of buckets.entries()) {
    if (now - entry.ts > CLEAN_INTERVAL) buckets.delete(ip);
  }
}, CLEAN_INTERVAL);

/**
 * Extracts reliable client IP
 */
function getClientIP(req: Request): string {
  // Cloudflare / proxy header
  let ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.ip ||
    "anon";

  if (Array.isArray(ip)) ip = ip[0];

  // Normalize IPv6 -> IPv4-mapped (::ffff:127.0.0.1)
  ip = String(ip).replace("::ffff:", "");

  // Remove multiple forwarded IPs
  if (ip.includes(",")) ip = ip.split(",")[0].trim();

  return ip;
}

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIP(req);
  const now = Date.now();

  const bucket = buckets.get(ip);

  // 🔄 Reset bucket if outside window
  if (!bucket || now - bucket.ts > WINDOW_MS) {
    buckets.set(ip, { ts: now, count: 1 });
    return next();
  }

  // Increment
  bucket.count++;

  // ❌ Over limit
  if (bucket.count > LIMIT) {
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - bucket.ts)) / 1000);

    res.setHeader("Retry-After", retryAfterSec.toString());

    return res.status(429).json({
      error: "rate_limited",
      ip,
      limit: LIMIT,
      retryAfterSec,
    });
  }

  buckets.set(ip, bucket);
  return next();
}
