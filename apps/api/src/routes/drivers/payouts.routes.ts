// src/routes/payouts.routes.ts
import { Router, Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireAdmin";
import { DriverPayoutController } from "../../modules/driver/driverPayout.controller";
import { AuthRequest } from "../../middleware/requireAuth";

const router = Router();

/**
 * DRIVER ROUTES
 */

// POST /drivers/payouts/request
router.post(
  "/request",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    return DriverPayoutController.requestPayout(authReq, res);
  })
);

// GET /drivers/payouts/me
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    return DriverPayoutController.myPayouts(authReq, res);
  })
);

/**
 * ADMIN ROUTES
 */

// GET /admin/payouts
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    return DriverPayoutController.listAll(authReq, res);
  })
);

// GET /admin/payouts/:id
router.get(
  "/:id",
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    return DriverPayoutController.getOne(authReq, res);
  })
);

export default router;
