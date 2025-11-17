// src/routes/admin/dlq.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";
import { reprocessDLQ } from "../../worker/dlq/dlq.processor";

const router = Router();

/**
 * GET /admin/dlq
 * Returns last 200 DLQ entries ordered by newest first
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
 * POST /admin/dlq/reprocess
 * body: { id }
 */
router.post(
  "/reprocess",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "DLQ id is required" });
    }

    const result = await reprocessDLQ(id);

    res.json(result);
  })
);

export default router;
