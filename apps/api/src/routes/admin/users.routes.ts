// src/routes/admin/users.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";

const router = Router();

/**
 * GET /api/admin/users
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { driver: true, passenger: true }
    });
    res.json(users);
  })
);

/**
 * POST /api/admin/users/toggle-admin
 * body: { userId }
 */
router.post(
  "/toggle-admin",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "not_found" });

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: !user.isAdmin }
    });

    res.json({ ok: true, user: updated });
  })
);

/**
 * POST /api/admin/users/suspend
 * body: { userId }
 */
router.post(
  "/suspend",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { userId } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: { suspended: true }
    });

    res.json({ ok: true });
  })
);

export default router;
