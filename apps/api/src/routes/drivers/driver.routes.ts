// src/routes/drivers/driver.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { DriverService } from "../../modules/driver/driver.service";

const router = Router();

/**
 * POST /api/drivers
 * Admin creates a new driver
 */
router.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const driver = await DriverService.createDriver(req.body);
    res.json({ ok: true, driver });
  })
);

/**
 * GET /api/drivers/me
 * Driver fetches own profile
 */
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const driverId = (req as any).user.sub;
    const driver = await DriverService.getDriver(driverId);
    res.json({ ok: true, driver });
  })
);

/**
 * GET /api/drivers
 * Admin lists all drivers
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const drivers = await DriverService.listDrivers();
    res.json({ ok: true, drivers });
  })
);

/**
 * PUT /api/drivers/:driverId
 * Admin update driver profile
 */
router.put(
  "/:driverId",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const driver = await DriverService.updateDriver(req.params.driverId, req.body);
    res.json({ ok: true, driver });
  })
);

export default router;
