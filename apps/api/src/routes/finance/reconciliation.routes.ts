// src/routes/finance/reconciliation.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { ReconciliationService } from "../../modules/finance/reconciliation.service";

const router = Router();

/**
 * POST /api/finance/reconcile
 * body: { from?, to? }
 */
router.post(
  "/reconcile",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { from, to } = req.body;
    const report = await ReconciliationService.reconcileBookings({ from, to });
    res.json(report);
  })
);

/**
 * GET /api/finance/unreconciled?limit=100
 */
router.get(
  "/unreconciled",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 100;
    const rows = await ReconciliationService.findUnreconciled({ limit });
    res.json({ total: rows.length, rows });
  })
);

export default router;
