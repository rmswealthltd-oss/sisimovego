// src/routes/refunds/refundAdmin.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";
import { RefundService } from "../../modules/payments/refund.service";

const router = Router();

/**
 * GET /api/refunds/admin/list
 */
router.get(
  "/list",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const rows = await prisma.refund.findMany({
      orderBy: { createdAt: "desc" },
      include: { booking: true }
    });
    return res.json(rows);
  })
);

/**
 * POST /api/refunds/admin/approve
 * body: { refundId }
 */
router.post(
  "/approve",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { refundId } = req.body;
    const refund = await prisma.refund.update({
      where: { id: refundId },
      data: { status: "APPROVED" }
    });
    return res.json({ ok: true, refund });
  })
);

/**
 * POST /api/refunds/admin/complete
 * body: { refundId, providerTxId }
 */
router.post(
  "/complete",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { refundId, providerTxId } = req.body;
    const refund = await RefundService.markRefundPaid(refundId, providerTxId);
    return res.json({ ok: true, refund });
  })
);

export default router;
