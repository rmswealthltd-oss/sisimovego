// src/routes/admin/settings.routes.ts
import { Router } from "express";
import prisma from "../../db";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAdmin } from "../../middleware/requireAdmin";

const router = Router();

// GET /api/admin/settings
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_, res) => {
    const settings = await prisma.systemSetting.findMany();
    res.json(settings);
  })
);

// PUT /api/admin/settings/:key
router.put(
  "/:key",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;

    const updated = await prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    res.json(updated);
  })
);

export default router;
