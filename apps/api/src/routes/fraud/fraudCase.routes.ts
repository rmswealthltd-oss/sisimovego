// src/routes/fraud/fraudCase.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { FraudCaseService } from "../../modules/fraud/fraudCase.service";

const router = Router();

/**
 * GET /api/fraud/cases
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const rows = await FraudCaseService.listCases();
    return res.json(rows);
  })
);

/**
 * POST /api/fraud/cases/update-status
 * body: { caseId, status }
 */
router.post(
  "/update-status",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { caseId, status } = req.body;
    const row = await FraudCaseService.updateStatus(caseId, status);
    return res.json(row);
  })
);

export default router;
