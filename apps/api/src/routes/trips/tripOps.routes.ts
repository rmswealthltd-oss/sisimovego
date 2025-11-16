// src/routes/trips/tripOps.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";
import { TripService } from "../../modules/trips/trip.service";
import { TripAssignmentService } from "../../modules/trips/tripAssignment.service";

const router = Router();

/**
 * GET /api/trips/admin/list
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const trips = await prisma.trip.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    res.json({ trips });
  })
);

/**
 * POST /api/trips/admin/assign
 * body: { tripId, driverId }
 */
router.post(
  "/assign",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { tripId, driverId } = req.body;
    const result = await TripAssignmentService.assignDriverToTrip(tripId, driverId);
    res.json({ ok: true, result });
  })
);

/**
 * POST /api/trips/admin/force-cancel
 * body: { tripId, reason }
 */
router.post(
  "/force-cancel",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { tripId, reason } = req.body;
    const out = await TripService.cancelTrip(tripId, reason);
    res.json(out);
  })
);

export default router;
