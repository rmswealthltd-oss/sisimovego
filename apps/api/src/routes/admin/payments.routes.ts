import { Router } from "express";
import prisma from "../../db";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

// GET /admin/payments
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const payments = await prisma.payment.findMany({
      include: { user: true, booking: true, tripRequest: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ ok: true, payments });
  })
);

// GET /admin/payments/:id
router.get(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: { user: true, booking: true, tripRequest: true },
    });

    if (!payment) return res.status(404).json({ error: "not_found" });

    res.json({ ok: true, payment });
  })
);

export default router;
