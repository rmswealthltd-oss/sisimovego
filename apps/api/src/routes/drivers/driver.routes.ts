// src/routes/drivers/driver.routes.ts
import { Router, Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireAdmin";
import { DriverController } from "../../modules/driver/driver.controller";
import { AuthRequest } from "../../middleware/requireAuth";

const router = Router();

/**
 * DRIVER ROUTES
 */

// GET /drivers/me
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // cast req to AuthRequest to access `user`
    const authReq = req as AuthRequest;
    if (!authReq.user) return res.status(401).json({ message: "Unauthorized" });
    return DriverController.me(authReq, res);
  })
);

/**
 * ADMIN ROUTES
 */

// POST /drivers/verify-license
router.post(
  "/verify-license",
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    return DriverController.verifyLicense(authReq, res);
  })
);

// POST /drivers/approve
router.post(
  "/approve",
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    return DriverController.adminVerify(authReq, res);
  })
);

// GET /drivers
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    return DriverController.list(authReq, res);
  })
);

export default router;
