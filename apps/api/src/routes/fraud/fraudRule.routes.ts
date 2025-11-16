// src/routes/fraud/fraudRule.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";

const router = Router();

/**
 * GET /api/fraud/rules
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const rows = await prisma.fraudRule.findMany();
    return res.json(rows);
  })
);

/**
 * POST /api/fraud/rules
 * body: { name, type, active }
 */
router.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const row = await prisma.fraudRule.create({
      data: req.body
    });
    return res.json(row);
  })
);

export default router;
