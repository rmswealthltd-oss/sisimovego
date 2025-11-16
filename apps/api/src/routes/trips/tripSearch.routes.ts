// src/routes/trips/tripSearch.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";

const router = Router();

/**
 * GET /api/trips/search?origin=&destination=&date=&minSeats=&limit=
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { origin, destination, date, minSeats, limit } = req.query;

    const where: any = {};
    if (origin) where.origin = String(origin);
    if (destination) where.destination = String(destination);
    if (date) {
      const d = new Date(String(date));
      where.departureAt = { gte: d };
    }
    if (minSeats) where.seatsAvailable = { gte: Number(minSeats) };

    const rows = await prisma.trip.findMany({
      where,
      orderBy: { departureAt: "asc" },
      take: limit ? Number(limit) : 50
    });

    res.json({ trips: rows });
  })
);

export default router;
