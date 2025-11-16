// src/routes/payouts/payout.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";
import { PayoutService } from "../../modules/payments/payout.service";

const router = Router();

/**
 * POST /api/payouts/request
 * body: { amountCents, phone }
 *
 * Driver requests a payout.
 */
router.post(
  "/request",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = (req as any).user.sub;
    const { amountCents, phone } = req.body;

    if (!amountCents || !phone) {
      return res.status(400).json({ error: "missing_fields" });
    }

    const driver = await prisma.driver.findUnique({
      where: { userId }
    });

    if (!driver) return res.status(403).json({ error: "not_driver" });

    const payout = await PayoutService.createPayout({
      recipientId: driver.id,
      recipientPhone: phone,
      amountCents,
      description: `Driver payout for ${driver.id}`
    });

    return res.json({ ok: true, payout });
  })
);

/**
 * GET /api/payouts/my
 */
router.get(
  "/my",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = (req as any).user.sub;

    const driver = await prisma.driver.findUnique({ where: { userId } });
    if (!driver) return res.status(403).json({ error: "not_driver" });

    const rows = await prisma.payout.findMany({
      where: { driverId: driver.id },
      orderBy: { createdAt: "desc" }
    });

    return res.json(rows);
  })
);

export default router;
