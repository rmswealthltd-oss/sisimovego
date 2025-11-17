// src/routes/admin/payments.routes.ts
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
      include: { user: true, trip: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(payments);
  })
);

// GET /admin/payments/:id
router.get(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: { user: true, trip: true },
    });
    res.json(payment);
  })
);

export default router;
