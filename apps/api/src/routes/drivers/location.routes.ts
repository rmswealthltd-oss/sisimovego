// src/routes/drivers/location.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import { DriverLocationService } from "../../modules/trips/driverLocation.service";

const router = Router();

router.post(
  "/update",
  requireAuth,
  asyncHandler(async (req, res) => {
    const driverId = (req as any).user.sub;
    const { lat, lon } = req.body;

    const loc = await DriverLocationService.updateDriverLocation(driverId, lat, lon);

    res.json({ updated: true, location: loc });
  })
);

router.post(
  "/deactivate",
  requireAuth,
  asyncHandler(async (req, res) => {
    const driverId = (req as any).user.sub;

    const loc = await DriverLocationService.deactivateDriver(driverId);
    res.json({ deactivated: true, location: loc });
  })
);

export default router;
