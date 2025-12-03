// src/routes/refunds/refund.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import { RefundService } from "../../modules/payments/refund.service";
import prisma from "../../db";
import { z } from "zod";
import { validateBody } from "../../middleware/validate";

const router = Router();

// ------------------------------------
// Validation
// ------------------------------------
const requestRefundSchema = z.object({
  bookingId: z.string().uuid("Invalid bookingId"),
  reason: z.string().optional(),
});

/**
 * POST /api/refunds/request
 * Passenger initiates a refund request.
 */
router.post(
  "/request",
  requireAuth,
  validateBody(requestRefundSchema),
  asyncHandler(async (req, res) => {
    const userId = (req as any).user.sub;
    const { bookingId, reason } = req.body;

    // Load booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { passenger: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "booking_not_found" });
    }

    // Authorization: only booking owner can request refund
    if (booking.passengerId !== userId) {
      return res.status(403).json({ error: "not_owner" });
    }

    // Check payment status
    const amountCents = booking.amountPaid ?? 0;
    if (amountCents <= 0) {
      return res.status(400).json({ error: "no_payment_to_refund" });
    }

    // Avoid double refund
    const openRefund = await prisma.refund.findFirst({
      where: { bookingId, status: { in: ["PENDING", "APPROVED"] } }, // ✅ only valid RefundStatus values
    });

    if (openRefund) {
      return res.status(409).json({
        error: "refund_already_in_progress",
        refundId: openRefund.id,
      });
    }

    // Create refund request
    const refund = await RefundService.initiateRefund({
      userId,           // ✅ required
      bookingId,
      amountCents,
      reason: reason ?? null,
      requestedBy: userId,
    });

    return res.json({
      ok: true,
      refund,
    });
  })
);

export default router;
