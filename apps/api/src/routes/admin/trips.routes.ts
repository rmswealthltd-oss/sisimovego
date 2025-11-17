// src/routes/admin/trips.routes.ts
import { Router } from "express";
import prisma from "../../db";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

// GET /admin/trips
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const trips = await prisma.trip.findMany({
      include: {
        user: true,
        driver: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(trips);
  })
);

// GET /admin/trips/:id
router.get(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: { user: true, driver: true },
    });
    res.json(trip);
  })
);

// GET /admin/trips/status/:status
router.get(
  "/status/:status",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const trips = await prisma.trip.findMany({
      where: { status: req.params.status },
      include: { user: true, driver: true },
    });
    res.json(trips);
  })
);

export default router;
