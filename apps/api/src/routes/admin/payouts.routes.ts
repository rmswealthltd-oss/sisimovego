// src/routes/admin/payouts.routes.ts
import { Router } from "express";
import prisma, { PayoutStatus } from "../../db";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

/**
 * GET /admin/payouts
 * Admin list payouts (with filtering + pagination)
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const {
      page = "1",
      limit = "20",
      status,
      driverId,
      from,
      to,
      batchId
    } = req.query as Record<string, string>;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const where: any = {};

    if (status) where.status = status;
    if (driverId) where.driverId = driverId;
    if (batchId) where.batchId = batchId;

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [items, total] = await Promise.all([
      prisma.payout.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          driver: true,
          batch: true
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      }),
      prisma.payout.count({ where })
    ]);

    res.json({
      items,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    });
  })
);

/**
 * GET /admin/payouts/:id
 * Fetch payout details
 */
router.get(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payout = await prisma.payout.findUnique({
      where: { id: req.params.id },
      include: {
        driver: true,
        batch: true
      }
    });

    if (!payout) return res.status(404).json({ message: "Payout not found" });

    res.json(payout);
  })
);

/**
 * POST /admin/payouts/:id/approve
 */
router.post(
  "/:id/approve",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const updated = await prisma.payout.update({
      where: { id: req.params.id },
      data: {
        status: { set: PayoutStatus.APPROVED },
        approvedAt: new Date()
      }
    });

    res.json(updated);
  })
);

/**
 * POST /admin/payouts/:id/reject
 */
router.post(
  "/:id/reject",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const updated = await prisma.payout.update({
      where: { id: req.params.id },
      data: {
        status: { set: PayoutStatus.REJECTED },
        rejectedAt: new Date()
      }
    });

    res.json(updated);
  })
);

/**
 * GET /admin/payouts/batch/:batchId
 * Fetch payout batch + payouts inside it
 */
router.get(
  "/batch/:batchId",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const batch = await prisma.payoutBatch.findUnique({
      where: { id: req.params.batchId },
      include: {
        payouts: {
          include: { driver: true }
        }
      }
    });

    if (!batch) return res.status(404).json({ message: "Batch not found" });

    res.json(batch);
  })
);

/**
 * POST /admin/payouts/batch/:batchId/retry
 * Retries all FAILED payouts via outbox
 */
router.post(
  "/batch/:batchId/retry",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const failed = await prisma.payout.findMany({
      where: {
        batchId: req.params.batchId,
        status: PayoutStatus.FAILED
      }
    });

    for (const payout of failed) {
      await prisma.outboxEvent.create({
        data: {
          aggregateType: "Payout",
          aggregateId: payout.id,
          type: "Payout:Retry",
          payload: payout,
          status: "READY",
          channel: "payout"
        }
      });
    }

    res.json({
      retried: failed.length,
      message: "Retry jobs scheduled through Outbox"
    });
  })
);

export default router;
