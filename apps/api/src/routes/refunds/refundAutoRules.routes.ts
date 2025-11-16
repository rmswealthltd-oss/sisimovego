// src/routes/refunds/refundAutoRules.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { FraudEngineService } from "../../modules/fraud/fraudEngine.service";
import prisma from "../../db";

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
    const output = await FraudEngineService.runRulesAndGenerateCase(refundId);
    return res.json({ ok: true, output });
  })
);

export default router;
