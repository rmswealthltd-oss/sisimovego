import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import asyncHandler from "../../middleware/asyncHandler";
import prisma from "../../db";
import { env } from "../../env";
import { SettingsService } from "../../modules/system/settings.service";

const router = Router();

/**
 * GET /system/config
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const config = {
      NODE_ENV: env.NODE_ENV,
      PORT: env.PORT,
      PUSH_ENABLED: !!env.PUSH_PUBLIC_KEY,
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

    await SettingsService.reload();

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
    res.json(await prisma.setting.findMany());
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

    const updated = await SettingsService.set(key, value);
    res.json(updated);
  })
);

export default router;
