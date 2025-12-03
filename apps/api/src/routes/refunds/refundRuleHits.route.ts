// src/routes/refunds/refundRuleHits.route.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";

const router = Router();

/**
 * GET /api/refunds/rule-hits/:refundId
 * Returns all fraud rule hits for a refund, newest first
 */
router.get(
  "/:refundId",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { refundId } = req.params;

    if (!refundId) {
      return res.status(400).json({ error: "refundId is required" });
    }

    // Validate UUID format (basic check)
    if (!/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(refundId)) {
      return res.status(400).json({ error: "refundId must be a valid UUID" });
    }

    const hits = await prisma.fraudRuleHit.findMany({
      where: { refundId },
      include: { refund: true }, // include refund info if needed
      orderBy: { createdAt: "desc" },
    });

    return res.json(hits);
  })
);

export default router;
