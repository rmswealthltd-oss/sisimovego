// src/routes/trips/tripSearch.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";
import { z } from "zod";
import { validateQuery } from "../../middleware/validate";

const router = Router();

/* ----------------------------------------------------------
   ZOD schema for query params
----------------------------------------------------------- */
const searchSchema = z.object({
  origin: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  date: z.string().optional(), // YYYY-MM-DD or ISO
  minSeats: z.string().optional(),
  limit: z.string().optional(),
});

/* ----------------------------------------------------------
   GET /api/trips/search
----------------------------------------------------------- */
router.get(
  "/",
  validateQuery(searchSchema),
  asyncHandler(async (req, res) => {
    const { origin, destination, date, minSeats, limit } = req.query as any;

    const where: any = {};

    /* Origin (case-insensitive) */
    if (origin) {
      where.fromLocation = { equals: origin, mode: "insensitive" };
    }

    /* Destination (case-insensitive) */
    if (destination) {
      where.toLocation = { equals: destination, mode: "insensitive" };
    }

    /* Date filtering (full day match) */
    if (date) {
      const day = new Date(date);
      if (isNaN(day.getTime())) {
        return res.status(400).json({ error: "invalid_date_format" });
      }

      const start = new Date(day);
      start.setHours(0, 0, 0, 0);

      const end = new Date(day);
      end.setHours(23, 59, 59, 999);

      where.date = {
        gte: start,
        lte: end,
      };
    }

    /* Seat filtering */
    if (minSeats) {
      const seats = Number(minSeats);
      if (isNaN(seats) || seats < 1) {
        return res.status(400).json({ error: "invalid_minSeats" });
      }
      where.seatsAvailable = { gte: seats };
    }

    /* Limit (with max cap) */
    const take = Math.min(Number(limit || 50), 200);

    const trips = await prisma.trip.findMany({
      where,
      orderBy: { date: "asc" }, // sort by actual field
      take,
    });

    res.json({ ok: true, trips });
  })
);

export default router;
