// src/routes/system/config.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";
import { env } from "../../env";

const router = Router();

/**
 * GET /system/config
 * Returns safe environment/runtime config
 */
router.get(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const config = {
      NODE_ENV: env.NODE_ENV,
      PORT: env.PORT,
      MPESA_SHORTCODE: Boolean(env.MPESA_SHORTCODE),
      PUSH_ENABLED: Boolean(env.PUSH_PUBLIC_KEY && env.PUSH_PRIVATE_KEY),
      EMAIL_ENABLED: Boolean(env.EMAIL_SMTP_HOST),
    };

    return res.json({ ok: true, config });
  })
);

/**
 * POST /system/config/reload
 * Creates an Outbox event for config reload
 */
router.post(
  "/reload",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const userId = (req as any).user?.id ?? "admin";

    await prisma.outboxEvent.create({
      data: {
        aggregateType: "System",
        aggregateId: "config_reload",
        type: "ConfigReloadRequested",
        payload: JSON.stringify({ requestedBy: userId }),
        channel: "admin",
        status: "READY",
      },
    });

    return res.json({ ok: true, reloaded: true });
  })
);

/**
 * GET /system/config/settings
 * Returns all key/value settings
 */
router.get(
  "/settings",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const settings = await prisma.systemSetting.findMany({
      orderBy: { key: "asc" },
    });

    return res.json(settings);
  })
);

/**
 * PUT /system/config/settings/:key
 * Updates or creates a setting
 */
router.put(
  "/settings/:key",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;

    if (typeof value !== "string") {
      return res.status(400).json({
        error: "Setting value must be a string",
      });
    }

    const updated = await prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return res.json(updated);
  })
);

export default router;
