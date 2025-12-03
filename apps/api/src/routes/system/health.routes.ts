// src/routes/system/health.routes.ts
import { Router } from "express";
import prisma from "../../db";

const router = Router();

/**
 * GET /system/health
 * Basic service health check including DB readiness.
 */
router.get(
  "/",
  async (req, res) => {
    const started = Date.now();

    const status: any = {
      ok: true,
      timestamp: new Date().toISOString(),
    };

    // Database check
    try {
      await prisma.$queryRaw`SELECT 1`;
      status.db = "ok";
    } catch (err: any) {
      status.ok = false;
      status.db = {
        ok: false,
        error: err?.message ?? String(err),
      };
    }

    status.latencyMs = Date.now() - started;

    return res.json(status);
  }
);

export default router;
