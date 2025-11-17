import { Router } from "express";
import prisma from "../../db";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAdmin } from "../../middleware/requireAdmin";

const router = Router();

// GET /api/admin/notifications
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_, res) => {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
  })
);

export default router;
