// src/routes/admin/ops.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { OpsService } from "../../modules/admin/ops.service";

const router = Router();

/**
 * POST /api/admin/ops/force-complete-trip
 * body: { tripId }
 */
router.post(
  "/force-complete-trip",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { tripId } = req.body;
    const out = await OpsService.forceCompleteTrip(tripId);
    res.json(out);
  })
);

/**
 * POST /api/admin/ops/fix-booking
 * body: { bookingId }
 */
router.post(
  "/fix-booking",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { bookingId } = req.body;
    const out = await OpsService.fixBooking(bookingId);
    res.json(out);
  })
);

export default router;
