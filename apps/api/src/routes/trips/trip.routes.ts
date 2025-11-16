// src/routes/trips/trip.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { TripService } from "../../modules/trips/trip.service";
import { z } from "zod";
import { validateBody } from "../../middleware/validate";

const router = Router();

const createSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  departureAt: z.string(), // ISO
  seatsTotal: z.number().int().min(1),
  pricePerSeat: z.number().int().min(0)
});

router.post(
  "/",
  requireAuth,
  validateBody(createSchema),
  asyncHandler(async (req, res) => {
    const driverId = (req as any).user.sub;
    const { origin, destination, departureAt, seatsTotal, pricePerSeat } = req.body;
    const trip = await TripService.createTrip(driverId, {
      origin,
      destination,
      departureAt: new Date(departureAt),
      seatsTotal,
      pricePerSeat
    });
    res.status(201).json({ trip });
  })
);

router.get(
  "/:tripId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const trip = await TripService.getTrip(req.params.tripId);
    if (!trip) return res.status(404).json({ error: "not_found" });
    res.json({ trip });
  })
);

// start, arrive, complete, cancel — driver or admin
router.post(
  "/:tripId/start",
  requireAuth,
  asyncHandler(async (req, res) => {
    const driverId = (req as any).user.sub;
    const out = await TripService.startTrip(req.params.tripId, driverId);
    res.json(out);
  })
);

router.post(
  "/:tripId/arrive",
  requireAuth,
  asyncHandler(async (req, res) => {
    const driverId = (req as any).user.sub;
    const out = await TripService.arrive(req.params.tripId, driverId);
    res.json(out);
  })
);

router.post(
  "/:tripId/complete",
  requireAuth,
  asyncHandler(async (req, res) => {
    const driverId = (req as any).user.sub;
    const out = await TripService.completeTrip(req.params.tripId, driverId);
    res.json(out);
  })
);

router.post(
  "/:tripId/cancel",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const out = await TripService.cancelTrip(req.params.tripId, reason);
    res.json(out);
  })
);

export default router;
