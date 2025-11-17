// src/routes/admin/analytics.routes.ts
import { Router } from "express";
import prisma from "../../db";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { AnalyticsService } from "../../modules/admin/analytics.service";

const router = Router();

/**
 * GET /admin/analytics
 * Basic dashboard stats (users, drivers, trips, bookings)
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_, res) => {
    const [users, drivers, trips, bookings] = await Promise.all([
      prisma.user.count(),
      prisma.driver.count(),
      prisma.trip.count(),
      prisma.booking.count(),
    ]);

    res.json({ users, drivers, trips, bookings });
  })
);

/**
 * GET /admin/analytics/overview
 */
router.get(
  "/overview",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    res.json(await AnalyticsService.getOverview());
  })
);

/**
 * GET /admin/analytics/revenue
 */
router.get(
  "/revenue",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    res.json(await AnalyticsService.revenueSeries());
  })
);

/**
 * GET /admin/analytics/trips
 */
router.get(
  "/trips",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    res.json(await AnalyticsService.tripMetrics());
  })
);

export default router;
