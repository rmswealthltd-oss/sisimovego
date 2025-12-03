//apps/api/src/routes/passengers/booking.routes.ts
import { Router, Request, Response } from "express";
import { requireAuth, AuthRequest } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import { BookingController } from "../../modules/bookings/booking.controller";
import { validateBody } from "../../middleware/validate";
import { z } from "zod";
import { rateLimit } from "../../middleware/rateLimit";

const router = Router();

// Kenya MPESA phone number: 2547XXXXXXXX
const phoneRegex = /^2547\d{8}$/;

/* ------------------- Validation Schemas ------------------- */
const createSchema = z.object({
  tripId: z.string().uuid(),

  seats: z
    .number()
    .int()
    .min(1)
    .max(10) // prevent abuse / spam
    .optional(),

  paymentMethod: z
    .enum(["MPESA", "STRIPE", "ON_PICKUP"])
    .optional()
    .default("MPESA"),

  idempotencyKey: z.string().max(100).optional(),

  phone: z.string().regex(phoneRegex, "Invalid phone format. Use 2547XXXXXXXX").optional(),
});

const cancelSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.string().max(300).optional(),
});

/* ------------------- Routes ------------------- */

// Create a booking
router.post(
  "/",
  rateLimit,
  requireAuth,
  validateBody(createSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    return BookingController.create(authReq, res);
  })
);

// Cancel a booking
router.post(
  "/cancel",
  requireAuth,
  validateBody(cancelSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    return BookingController.cancel(authReq, res);
  })
);

// Get bookings for the logged-in user
router.get(
  "/my",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    return BookingController.myBookings(authReq, res);
  })
);

export default router;
