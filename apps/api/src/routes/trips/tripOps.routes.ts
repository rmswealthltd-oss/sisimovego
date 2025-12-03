// src/routes/trips/tripOps.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";
import { TripAssignmentService } from "../../modules/trips/tripAssignment.service";
import { z } from "zod";
import { validateBody } from "../../middleware/validate";

const router = Router();

/* ----------------------------------------------------------
   GET /api/trips/admin/list
----------------------------------------------------------- */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const trips = await prisma.trip.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        driver: true,
        bookings: true,
      },
    });

    res.json({ ok: true, trips });
  })
);

/* ----------------------------------------------------------
   POST /api/trips/admin/assign
   body: { tripId, driverId }
----------------------------------------------------------- */

const assignSchema = z.object({
  tripId: z.string().uuid(),
  driverId: z.string().uuid(),
});

router.post(
  "/assign",
  requireAdmin,
  validateBody(assignSchema),
  asyncHandler(async (req, res) => {
    const { tripId, driverId } = req.body;

    // Ensure trip exists
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: "trip_not_found" });

    // Ensure driver exists
    const driver = await prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) return res.status(404).json({ error: "driver_not_found" });

    const result = await TripAssignmentService.assignDriverToTrip(
      tripId,
      driverId
    );

    res.json({ ok: true, result });
  })
);

/* ----------------------------------------------------------
   POST /api/trips/admin/force-cancel
   body: { tripId, reason }
----------------------------------------------------------- */

const forceCancelSchema = z.object({
  tripId: z.string().uuid(),
  reason: z.string().min(1).optional(),
});

router.post(
  "/force-cancel",
  requireAdmin,
  validateBody(forceCancelSchema),
  asyncHandler(async (req, res) => {
    const { tripId, reason } = req.body;

    // Ensure trip exists
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ error: "trip_not_found" });

    // Cancel trip
    const updated = await prisma.trip.update({
      where: { id: tripId },
      data: {
        status: "CANCELLED",
        canceledAt: new Date(),
        cancelReason: reason || "Cancelled by admin",
      },
    });

    // Optional: write to audit table
    await prisma.tripStatusAudit.create({
      data: {
        tripId,
        status: "CANCELLED",
      },
    });

    res.json({ ok: true, trip: updated });
  })
);

export default router;
