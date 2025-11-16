// src/routes/refunds/refundRuleHits.route.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";

const router = Router();

/**
 * GET /api/refunds/rule-hits/:refundId
 */
router.get(
  "/:refundId",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { refundId } = req.params;

    const rows = await prisma.fraudRuleHit.findMany({
      where: { refundId },
      include: { rule: true }
    });

    return res.json(rows);
  })
);

export default router;
