//apps/api/src/routes/trips/trip.routes.ts
import { Router, Response } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import { TripService } from "../../modules/trips/trip.service";
import { z } from "zod";
import { validateBody } from "../../middleware/validate";
import prisma from "../../db";

const router = Router();

/* ----------------------- Validation ----------------------- */
const createSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  departureAt: z.string(), // ISO date string
  seatsTotal: z.number().int().min(1),
  pricePerSeat: z.number().int().min(0),
});

/* ----------------------------------------------------------
   POST /api/trips  — create trip (driver only)
----------------------------------------------------------- */
router.post(
  "/",
  requireAuth,
  validateBody(createSchema),
  asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "unauthenticated" });

    const driver = await prisma.driver.findUnique({ where: { userId } });
    if (!driver) return res.status(403).json({ error: "not_driver" });

    const { origin, destination, departureAt, seatsTotal, pricePerSeat } = req.body;

    const trip = await TripService.createTrip(driver.id, driver.id, {
      fromLocation: origin,
      toLocation: destination,
      date: new Date(departureAt),
      totalSeats: seatsTotal,
      pricePerSeat,
    });

    res.status(201).json({ trip });
  })
);

/* ----------------------------------------------------------
   GET /api/trips/:tripId
----------------------------------------------------------- */
router.get(
  "/:tripId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const trip = await TripService.getTrip(req.params.tripId);
    if (!trip) return res.status(404).json({ error: "not_found" });
    res.json({ trip });
  })
);

/* ----------------------------------------------------------
   DRIVER ACTIONS: start / complete / cancel
----------------------------------------------------------- */
async function getDriverIdOr403(userId: string | undefined, res: Response) {
  if (!userId) {
    res.status(401).json({ error: "unauthenticated" });
    return null;
  }

  const driver = await prisma.driver.findUnique({ where: { userId } });
  if (!driver) {
    res.status(403).json({ error: "not_driver" });
    return null;
  }

  return driver.id;
}

router.post(
  "/:tripId/start",
  requireAuth,
  asyncHandler(async (req, res) => {
    const driverId = await getDriverIdOr403(req.user?.id, res);
    if (!driverId) return;

    const out = await TripService.restartTrip(req.params.tripId);
    res.json(out);
  })
);

router.post(
  "/:tripId/complete",
  requireAuth,
  asyncHandler(async (req, res) => {
    const driverId = await getDriverIdOr403(req.user?.id, res);
    if (!driverId) return;

    const out = await TripService.forceComplete(req.params.tripId);
    res.json(out);
  })
);

router.post(
  "/:tripId/cancel",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ error: "reason_required" });

    const out = await TripService.cancelTrip(req.params.tripId, reason);
    res.json(out);
  })
);

export default router;
