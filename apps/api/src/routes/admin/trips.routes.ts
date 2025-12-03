import { Router } from "express";
import prisma from "../../db";
import { TripStatus } from "@prisma/client"; // ✅ Import enum from Prisma client
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

// GET /admin/trips
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const trips = await prisma.trip.findMany({
      include: { owner: true, driver: true },
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
      include: { owner: true, driver: true },
    });
    res.json(trip);
  })
);

// GET /admin/trips/status/:status
router.get(
  "/status/:status",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const statusParam = req.params.status.toUpperCase() as keyof typeof TripStatus;

    if (!(statusParam in TripStatus)) {
      return res.status(400).json({ message: "Invalid trip status" });
    }

    const trips = await prisma.trip.findMany({
      where: { status: TripStatus[statusParam] },
      include: { owner: true, driver: true },
    });

    res.json(trips);
  })
);

export default router;
