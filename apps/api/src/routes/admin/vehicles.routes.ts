import { Router } from "express";
import prisma from "../../db";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

// GET /admin/vehicles
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const vehicles = await prisma.vehicle.findMany({
      include: { driver: true },
    });
    res.json(vehicles);
  })
);

// GET /admin/vehicles/:id
router.get(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
      include: { driver: true },
    });

    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    res.json(vehicle);
  })
);

export default router;
