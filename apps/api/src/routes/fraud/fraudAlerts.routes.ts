// src/routes/fraud/fraudAlerts.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";

const router = Router();

/**
 * GET /api/fraud/alerts
 * Returns high-risk refunds or open cases
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const cases = await prisma.fraudCase.findMany({
      where: { score: { gte: 50 }, status: "OPEN" },
      include: { refund: true }
    });

    return res.json(cases);
  })
);

export default router;
