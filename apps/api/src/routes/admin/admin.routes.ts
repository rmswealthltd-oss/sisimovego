// src/routes/admin/admin.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

/**
 * GET /api/admin
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    res.json({ ok: true, message: "Admin API is live" });
  })
);

export default router;
