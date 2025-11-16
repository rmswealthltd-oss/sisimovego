// src/routes/drivers/driver.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { DriverService } from "../../modules/driver/driver.service";

const router = Router();

// admin creates driver
router.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const driver = await DriverService.createDriver(req.body);
    res.json({ driver });
  })
);

// get driver profile
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const driverId = (req as any).user.sub;
    const driver = await DriverService.getDriver(driverId);
    res.json({ driver });
  })
);

// admin list drivers
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const drivers = await DriverService.listDrivers();
    res.json({ drivers });
  })
);

// update driver
router.put(
  "/:driverId",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const driver = await DriverService.updateDriver(req.params.driverId, req.body);
    res.json({ driver });
  })
);

export default router;
