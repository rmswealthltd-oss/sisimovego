// src/routes/system/config.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";
import { env } from "../../env";

const router = Router();

/**
 * GET /system/config
 * Safe environment/runtime config
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const config = {
      NODE_ENV: env.NODE_ENV,
      PORT: env.PORT,
      MPESA_SHORTCODE: !!env.MPESA_SHORTCODE,
      PUSH_ENABLED: !!env.PUSH_PUBLIC_KEY && !!env.PUSH_PRIVATE_KEY,
      EMAIL_ENABLED: !!env.EMAIL_SMTP_HOST,
    };

    res.json({ ok: true, config });
  })
);

/**
 * POST /system/config/reload
 */
router.post(
  "/reload",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await prisma.outbox.create({
      data: {
        aggregateType: "System",
        aggregateId: "config_reload",
        type: "ConfigReloadRequested",
        payload: JSON.stringify({
          requestedBy: (req as any).user?.sub ?? "admin",
        }),
        channel: "admin",
        status: "READY",
      },
    });

    res.json({ ok: true, reloaded: true });
  })
);

/**
 * GET /system/config/settings
 */
router.get(
  "/settings",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const settings = await prisma.setting.findMany();
    res.json(settings);
  })
);

/**
 * PUT /system/config/settings/:key
 */
router.put(
  "/settings/:key",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;

    const updated = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    res.json(updated);
  })
);

export default router;
