// src/routes/admin/drivers.routes.ts
import { Router } from "express";
import prisma from "../../db";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

/**
 * GET /api/admin/drivers
 * List all drivers
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true, // include driver user info
        wallet: true, // include wallet info if needed
        _count: { select: { trips: true } },
      },
    });

    res.json({ ok: true, drivers });
  })
);

/**
 * GET /api/admin/drivers/:id
 * Get driver profile and trip history
 */
router.get(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const driver = await prisma.driver.findUnique({
      where: { id: req.params.id },
      include: {
        user: true, // include driver user info
        trips: true,
        wallet: true, // optional: include wallet info
      },
    });

    if (!driver) return res.status(404).json({ error: "not_found" });

    res.json({ ok: true, driver });
  })
);

/**
 * GET /api/admin/drivers/:id/trips
 * Get all trips for a driver
 */
router.get(
  "/:id/trips",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const trips = await prisma.trip.findMany({
      where: { driverId: req.params.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({ ok: true, trips });
  })
);

export default router;
