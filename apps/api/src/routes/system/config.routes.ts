// src/routes/system/config.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { env } from "../../env";
import prisma from "../../db";

const router = Router();

/**
 * GET /api/system/config
 * Returns a safe subset of runtime configuration.
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const config = {
      NODE_ENV: env.NODE_ENV,
      PORT: env.PORT,
      MPESA_SHORTCODE: !!env.MPESA_SHORTCODE,
      PUSH_ENABLED: !!env.PUSH_PUBLIC_KEY && !!env.PUSH_PRIVATE_KEY,
      EMAIL_ENABLED: !!env.EMAIL_SMTP_HOST
    };
    res.json({ ok: true, config });
  })
);

/**
 * POST /api/system/config/reload
 * Admin trigger to rebuild or refresh runtime caches (placeholder).
 */
router.post(
  "/reload",
  requireAdmin,
  asyncHandler(async (req, res) => {
    // example: rebuild transient caches, reload feature flags etc.
    // For now we just emit an outbox event for other services to act.
    await prisma.outbox.create({
      data: {
        aggregateType: "System",
        aggregateId: "config_reload",
        type: "ConfigReloadRequested",
        payload: JSON.stringify({ requestedBy: (req as any).user?.sub ?? "admin" }),
        channel: "admin",
        status: "READY"
      }
    });
    res.json({ ok: true, reloaded: true });
  })
);

export default router;
