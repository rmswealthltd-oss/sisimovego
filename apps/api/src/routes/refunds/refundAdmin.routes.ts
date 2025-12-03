// src/routes/refunds/refundAdmin.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";
import { RefundService } from "../../modules/payments/refund.service";
import { validateBody } from "../../middleware/validate";
import { z } from "zod";

const router = Router();

// -------------------------------
// Validation
// -------------------------------
const idSchema = z.object({
  refundId: z.string().uuid("Invalid refundId"),
});

const completeSchema = z.object({
  refundId: z.string().uuid("Invalid refundId"),
  providerTxId: z.string().min(1, "providerTxId is required"),
});

/**
 * GET /api/refunds/admin/list
 * List all refunds with booking data
 */
router.get(
  "/list",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const rows = await prisma.refund.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          include: {
            passenger: true,
            trip: true,
          },
        },
      },
    });

    return res.json(rows);
  })
);

/**
 * POST /api/refunds/admin/approve
 * Approve a pending refund
 */
router.post(
  "/approve",
  requireAdmin,
  validateBody(idSchema),
  asyncHandler(async (req, res) => {
    const { refundId } = req.body;

    const refund = await prisma.refund.findUnique({
      where: { id: refundId },
    });

    if (!refund) {
      return res.status(404).json({ error: "refund_not_found" });
    }

    if (refund.status !== "PENDING") {
      return res.status(400).json({
        error: "invalid_status",
        message: `Refund must be PENDING to APPROVE (current: ${refund.status})`,
      });
    }

    const updated = await prisma.refund.update({
      where: { id: refundId },
      data: { status: "APPROVED" },
    });

    return res.json({ ok: true, refund: updated });
  })
);

/**
 * POST /api/refunds/admin/complete
 * Manually complete a refund after payment is executed
 */
router.post(
  "/complete",
  requireAdmin,
  validateBody(completeSchema),
  asyncHandler(async (req, res) => {
    const { refundId, providerTxId } = req.body;

    const refund = await prisma.refund.findUnique({
      where: { id: refundId },
    });

    if (!refund) {
      return res.status(404).json({ error: "refund_not_found" });
    }

    if (refund.status !== "APPROVED") {
      return res.status(400).json({
        error: "invalid_status",
        message: `Refund must be APPROVED to COMPLETE (current: ${refund.status})`,
      });
    }

    // RefundService handles:
    // - wallet debit
    // - ledger
    // - outbox
    // - marking refund COMPLETED
    const result = await RefundService.markRefundPaid(refundId, providerTxId);

    return res.json({
      ok: true,
      refund: result,
    });
  })
);

export default router;
