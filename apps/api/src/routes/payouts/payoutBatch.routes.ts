// src/routes/payouts/payout.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";
import { PayoutService } from "../../modules/payments/payout.service";
import { z } from "zod";

const router = Router();

// ----------------------------
// Validation Schema
// ----------------------------
const PayoutRequestSchema = z.object({
  amountCents: z.number().int().positive(),
  phone: z.string().min(8),
});

/**
 * POST /api/payouts/request
 * Driver requests cashout
 */
router.post(
  "/request",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = (req as any).user.sub;

    const parse = PayoutRequestSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        error: "invalid_payload",
        details: parse.error.flatten(),
      });
    }

    const { amountCents, phone } = parse.data;

    // 1. Check driver existence
    const driver = await prisma.driver.findUnique({ where: { userId } });
    if (!driver) {
      return res.status(403).json({ error: "not_driver" });
    }

    // 2. Create payout request using recipientId / recipientPhone
    const payout = await PayoutService.createPayout({
      recipientId: driver.id,
      recipientPhone: phone,
      amountCents,
      description: `Driver payout request for driver ${driver.id}`,
    });

    return res.json({ ok: true, payout });
  })
);

/**
 * GET /api/payouts/my
 * Driver views their payout history
 */
router.get(
  "/my",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = (req as any).user.sub;

    const driver = await prisma.driver.findUnique({ where: { userId } });
    if (!driver) {
      return res.status(403).json({ error: "not_driver" });
    }

    const payouts = await prisma.payout.findMany({
      where: { driverId: driver.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json(payouts);
  })
);

export default router;
