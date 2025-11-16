// src/routes/drivers/payouts.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import { DriverPayoutService } from "../../modules/driver/driverPayout.service";

const router = Router();

/**
 * POST /api/drivers/payouts
 * body { amountCents }
 */
router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { amountCents } = req.body;
    const driverId = (req as any).user.sub;

    const payout = await DriverPayoutService.payoutToDriver(driverId, Number(amountCents));
    res.json({ payout });
  })
);

export default router;
