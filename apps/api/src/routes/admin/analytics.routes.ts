// src/routes/admin/analytics.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { AnalyticsService } from "../../modules/admin/analytics.service";

const router = Router();

/**
 * GET /api/admin/analytics/overview
 */
router.get(
  "/overview",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const data = await AnalyticsService.getOverview();
    res.json(data);
  })
);

/**
 * GET /api/admin/analytics/revenue
 */
router.get(
  "/revenue",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    res.json(await AnalyticsService.revenueSeries());
  })
);

/**
 * GET /api/admin/analytics/trips
 */
router.get(
  "/trips",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    res.json(await AnalyticsService.tripMetrics());
  })
);

export default router;
