// src/routes/refunds/refundAutoRules.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { FraudEngineService } from "../../modules/fraud/fraudEngine.service";

const router = Router();

/**
 * GET /api/refunds/auto-rules/:refundId
 * Returns rule evaluation results.
 */
router.get(
  "/:refundId",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { refundId } = req.params;

    if (!refundId) {
      return res.status(400).json({ error: "refundId is required" });
    }

    const result = await FraudEngineService.evaluateRefund(refundId);

    return res.json(result);
  })
);

/**
 * POST /api/refunds/auto-rules/trigger
 * body: { refundId }
 */
router.post(
  "/trigger",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { refundId } = req.body;

    if (!refundId) {
      return res.status(400).json({ error: "refundId is required" });
    }

    const output = await FraudEngineService.runRulesAndGenerateCase(refundId);

    return res.json({
      ok: true,
      output,
    });
  })
);

export default router;
