import { Request, Response } from "express";
import prisma from "../../db";
import { BookingService } from "./booking.service";

// Define exact user shape
export type AuthUser = {
  id: string;
  email: string | null;
  firstName: string;
  middleName: string | null; // must be explicitly null if missing
  lastName: string;
  role: "USER" | "DRIVER" | "ADMIN";
};

// Extend Express Request
export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const BookingController = {
  async create(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: "unauthorized" });

    const passengerId = req.user.id;
    const { tripId, seats, paymentMethod, idempotencyKey, phone } = req.body;

    if (paymentMethod && !["MPESA", "STRIPE"].includes(paymentMethod)) {
      return res.status(400).json({ error: "invalid_payment_provider" });
    }

    try {
      const result = await BookingService.createBooking({
        tripId,
        passengerId,
        seats,
        paymentMethod,
        idempotencyKey,
        phone,
      });

      if (result.already) {
        return res.status(200).json({
          ok: true,
          idempotent: true,
          booking: result.booking,
        });
      }

      return res.status(201).json({ ok: true, booking: result.booking });
    } catch (err: any) {
      console.error("BookingController.create error:", err);

      if (err.message === "not_enough_seats") {
        return res.status(409).json({ error: "not_enough_seats" });
      }
      if (err.message === "trip_not_found") {
        return res.status(404).json({ error: "trip_not_found" });
      }

      return res.status(500).json({ error: "internal_error", details: err.message });
    }
  },

  async cancel(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: "unauthorized" });

    const passengerId = req.user.id;
    const { bookingId, reason } = req.body;

    try {
      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (!booking) return res.status(404).json({ error: "booking_not_found" });
      if (booking.passengerId !== passengerId) return res.status(403).json({ error: "not_owner" });

      const result = await BookingService.cancelBooking({ bookingId, reason });
      return res.json({ ok: true, booking: result });
    } catch (err: any) {
      console.error("BookingController.cancel error:", err);
      return res.status(500).json({ error: "internal_error" });
    }
  },

  async myBookings(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: "unauthorized" });

    const passengerId = req.user.id;

    try {
      const bookings = await prisma.booking.findMany({
        where: { passengerId },
        orderBy: { createdAt: "desc" },
        include: { trip: true, passenger: true },
        take: 200,
      });

      return res.json({ bookings });
    } catch (err: any) {
      console.error("BookingController.myBookings error:", err);
      return res.status(500).json({ error: "internal_error" });
    }
  },
};
