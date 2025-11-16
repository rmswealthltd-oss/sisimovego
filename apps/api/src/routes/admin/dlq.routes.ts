// src/routes/admin/dlq.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";
import { reprocessDLQ } from "../../worker/dlq/dlq.processor";

const router = Router();

/**
 * GET /api/admin/dlq
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const rows = await prisma.dlq.findMany({
      orderBy: { createdAt: "desc" },
      take: 200
    });
    res.json(rows);
  })
);

/**
 * POST /api/admin/dlq/reprocess
 * body: { id }
 */
router.post(
  "/reprocess",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.body;
    const result = await reprocessDLQ(id);
    res.json(result);
  })
);

export default router;
