// src/routes/payouts/payoutBatch.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { PayoutService } from "../../modules/payments/payout.service";
import prisma from "../../db";

const router = Router();

/**
 * POST /api/payouts/batch
 * body: [{ driverId, amountCents, phone }]
 */
router.post(
  "/batch",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const batch = req.body;
    if (!Array.isArray(batch)) {
      return res.status(400).json({ error: "invalid_array" });
    }

    const results = [];

    for (const item of batch) {
      try {
        const payout = await PayoutService.createPayout({
          recipientId: item.driverId,
          recipientPhone: item.phone,
          amountCents: item.amountCents,
          description: `Batch payout to ${item.driverId}`
        });

        results.push({ ok: true, payout });
      } catch (err: any) {
        results.push({ ok: false, error: err.message, item });
      }
    }

    return res.json({ results });
  })
);

/**
 * GET /api/payouts/batch/list
 */
router.get(
  "/list",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const rows = await prisma.payout.findMany({
      orderBy: { createdAt: "desc" },
      include: { driver: true }
    });
    return res.json(rows);
  })
);

export default router;
