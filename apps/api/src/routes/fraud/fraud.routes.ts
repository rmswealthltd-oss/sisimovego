// src/routes/fraud/fraud.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { FraudEngineService } from "../../modules/fraud/fraudEngine.service";

const router = Router();

router.post(
  "/evaluate",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { refundId } = req.body;
    const result = await FraudEngineService.checkRefund(refundId);
    return res.json(result);
  })
);

export default router;
