// src/routes/admin/ops.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";

import { OpsService } from "../../modules/admin/ops.service";
import { TripService } from "../../modules/trips/trip.service";

const router = Router();

/**
 * POST /admin/ops/force-complete-trip
 * body: { tripId }
 */
router.post(
  "/force-complete-trip",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { tripId } = req.body;
    const result = await OpsService.forceCompleteTrip(tripId);
    res.json({ ok: true, result });
  })
);

/**
 * POST /admin/ops/fix-booking
 * body: { bookingId }
 */
router.post(
  "/fix-booking",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { bookingId } = req.body;
    const result = await OpsService.fixBooking(bookingId);
    res.json({ ok: true, result });
  })
);

/**
 * POST /admin/ops/restart-trip/:tripId
 * Restarts an ongoing or stuck trip via TripService
 */
router.post(
  "/restart-trip/:tripId",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { tripId } = req.params;
    const result = await TripService.restartTrip(tripId);
    res.json({ ok: true, trip: result });
  })
);

/**
 * POST /admin/ops/force-complete/:tripId
 * Force completes a trip via TripService
 */
router.post(
  "/force-complete/:tripId",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { tripId } = req.params;
    const result = await TripService.forceComplete(tripId);
    res.json({ ok: true, trip: result });
  })
);

export default router;
