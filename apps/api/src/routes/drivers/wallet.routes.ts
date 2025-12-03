// src/routes/drivers/wallet.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { requireAuth, AuthRequest } from "../../middleware/requireAuth"; // ✅ import AuthRequest
import { WalletController } from "../../modules/wallet/wallet.controller";

const router = Router();

/**
 * GET /drivers/wallet/me
 * Returns the wallet balance for the logged-in driver
 */
router.get(
  "/me",
  requireAuth,
  asyncHandler((req, res, next) =>
    WalletController.getMyWallet(req as AuthRequest, res).catch(next)
  )
);

/**
 * POST /drivers/wallet/add
 * Optional: Add funds to wallet (for testing / top-ups)
 */
router.post(
  "/add",
  requireAuth,
  asyncHandler((req, res, next) =>
    WalletController.addFunds(req as AuthRequest, res).catch(next)
  )
);

export default router;
