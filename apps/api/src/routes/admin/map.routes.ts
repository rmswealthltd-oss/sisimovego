// src/routes/admin/map.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";

const router = Router();

/**
 * GET /api/admin/map/driver-locations
 */
router.get(
  "/driver-locations",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const rows = await prisma.driverLocation.findMany({
      orderBy: { updatedAt: "desc" },
      take: 300
    });
    res.json(rows);
  })
);

/**
 * GET /api/admin/map/trip-events/:tripId
 */
router.get(
  "/trip-events/:tripId",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const events = await prisma.tripStatusAudit.findMany({
      where: { tripId: req.params.tripId },
      orderBy: { createdAt: "asc" }
    });
    res.json(events);
  })
);

export default router;
