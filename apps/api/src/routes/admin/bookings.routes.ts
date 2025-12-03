// src/routes/admin/bookings.routes.ts
import { Router } from "express";
import prisma from "../../db";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAdmin } from "../../middleware/requireAdmin";

const router = Router();

// GET /api/admin/bookings
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_, res) => {
    const bookings = await prisma.booking.findMany({
      include: { passenger: true, trip: true }, // <-- corrected
      orderBy: { createdAt: "desc" },
    });
    res.json(bookings);
  })
);

// GET /api/admin/bookings/:id
router.get(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { passenger: true, trip: true }, // <-- corrected
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  })
);

export default router;
