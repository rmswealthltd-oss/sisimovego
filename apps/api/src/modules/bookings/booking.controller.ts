// src/modules/bookings/booking.controller.ts
import { BookingService } from "./booking.service";
import prisma from "../../db";

/**
 * Thin controller delegating to BookingService. Keeps route handlers small and testable.
 */
export const BookingController = {
  async create(req: any, res: any) {
    try {
      const passengerId = req.user.sub;
      const { tripId, seats, paymentMethod, idempotencyKey, phone } = req.body;

      const result: any = await BookingService.createBooking({
        tripId,
        passengerId,
        seats,
        paymentMethod,
        idempotencyKey,
        phone
      });

      if (result.already) {
        return res.status(200).json({ ok: true, idempotent: true, booking: result.booking });
      }

      return res.status(201).json({ ok: true, booking: result.booking });
    } catch (err: any) {
      if (err.message === "not_enough_seats") {
        return res.status(409).json({ error: "not_enough_seats" });
      }
      if (err.message === "trip_not_found") {
        return res.status(404).json({ error: "trip_not_found" });
      }
      console.error("BookingController.create error:", err);
      return res.status(500).json({ error: "internal_error", details: err.message });
    }
  },

  async cancel(req: any, res: any) {
    try {
      const passengerId = req.user.sub;
      const { bookingId, reason } = req.body;

      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (!booking) return res.status(404).json({ error: "booking_not_found" });
      if (booking.passengerId !== passengerId) return res.status(403).json({ error: "not_owner" });

      const out = await BookingService.cancelBooking({ bookingId, reason });
      return res.json({ ok: true, booking: out });
    } catch (err: any) {
      console.error("BookingController.cancel error:", err);
      return res.status(500).json({ error: "internal_error" });
    }
  },

  async myBookings(req: any, res: any) {
    try {
      const passengerId = req.user.sub;
      const rows = await prisma.booking.findMany({
        where: { passengerId },
        orderBy: { createdAt: "desc" },
        take: 200
      });
      return res.json({ bookings: rows });
    } catch (err: any) {
      console.error("BookingController.myBookings error:", err);
      return res.status(500).json({ error: "internal_error" });
    }
  }
};
