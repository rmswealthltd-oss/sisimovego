// src/routes/fraud/fraudScoreByRefund.route.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { FraudScoreService } from "../../modules/fraud/fraudScore.service";

const router = Router();

/**
 * GET /api/fraud/score/:refundId
 */
router.get(
  "/:refundId",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const score = await FraudScoreService.computeScore(req.params.refundId);
    return res.json({ refundId: req.params.refundId, score });
  })
);

export default router;
