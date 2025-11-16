// src/routes/system/health.routes.ts
import { Router } from "express";
import prisma from "../../db";

const router = Router();

/**
 * Basic health check. Returns DB and Redis readiness where possible.
 */
router.get("/", async (req, res) => {
  const start = Date.now();
  const resp: any = { ok: true, time: new Date().toISOString() };

  // Check DB
  try {
    await prisma.$queryRaw`SELECT 1`;
    resp.db = "ok";
  } catch (e: any) {
    resp.db = { ok: false, error: e.message || String(e) };
  }

  const duration = Date.now() - start;
  resp.latencyMs = duration;
  res.json(resp);
});

export default router;
