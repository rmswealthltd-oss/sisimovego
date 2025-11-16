// src/routes/passengers/booking.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import { BookingController } from "../../modules/bookings/booking.controller";
import { validateBody } from "../../middleware/validate";
import { z } from "zod";
import { rateLimit } from "../../middleware/rateLimit";

const router = Router();

const createSchema = z.object({
  tripId: z.string().uuid(),
  seats: z.number().int().min(1).optional(),
  paymentMethod: z.enum(["MPESA", "STRIPE", "ON_PICKUP"]).optional().default("MPESA"),
  idempotencyKey: z.string().optional(),
  phone: z.string().optional()
});

const cancelSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.string().optional()
});

// POST /api/passengers/bookings
router.post(
  "/",
  rateLimit,
  requireAuth,
  validateBody(createSchema),
  asyncHandler(async (req, res) => BookingController.create(req, res))
);

// POST /api/passengers/bookings/cancel
router.post(
  "/cancel",
  requireAuth,
  validateBody(cancelSchema),
  asyncHandler(async (req, res) => BookingController.cancel(req, res))
);

// GET /api/passengers/bookings/my
router.get(
  "/my",
  requireAuth,
  asyncHandler(async (req, res) => BookingController.myBookings(req, res))
);

export default router;
