import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { FraudScoreService } from "../../modules/fraud/fraudScore.service";
import prisma from "../../db"; // <-- your Prisma client

const router = Router();

/**
 * GET /api/fraud/score/:refundId
 */
router.get(
  "/:refundId",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { refundId } = req.params;

    // Pass prisma client as second argument
    const result = await FraudScoreService.computeScore(refundId, prisma);

    return res.json({
      refundId,
      score: result.score,
      eventCount: result.eventCount,
    });
  })
);

export default router;
