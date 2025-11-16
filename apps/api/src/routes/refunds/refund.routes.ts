// src/routes/refunds/refund.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import { RefundService } from "../../modules/payments/refund.service";
import prisma from "../../db";

const router = Router();

/**
 * POST /api/refunds/request
 * body: { bookingId, reason }
 *
 * Passenger initiates a refund.
 */
router.post(
  "/request",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = (req as any).user.sub;
    const { bookingId, reason } = req.body;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return res.status(404).json({ error: "booking_not_found" });
    if (booking.passengerId !== userId) return res.status(403).json({ error: "not_owner" });

    const amt = booking.amountPaid ?? 0;
    if (amt <= 0) return res.status(400).json({ error: "no_payment_to_refund" });

    const refund = await RefundService.initiateRefund({
      bookingId,
      amountCents: amt,
      reason,
      requestedBy: userId
    });

    return res.json({ ok: true, refund });
  })
);

export default router;
