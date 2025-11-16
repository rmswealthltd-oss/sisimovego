// src/routes/finance/ledger.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { LedgerService } from "../../modules/finance/ledger.service";

const router = Router();

/**
 * GET /api/finance/ledger
 * query: page, pageSize, walletId, bookingId, type, from, to
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { page, pageSize, walletId, bookingId, type, from, to } = req.query;
    const result = await LedgerService.queryLedger({
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 50,
      walletId: walletId ? String(walletId) : undefined,
      bookingId: bookingId ? String(bookingId) : undefined,
      type: type ? String(type) : undefined,
      from: from ? String(from) : undefined,
      to: to ? String(to) : undefined
    });
    res.json(result);
  })
);

/**
 * POST /api/finance/ledger
 * body: { walletId?, bookingId?, amount, type, description }
 */
router.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { walletId, bookingId, amount, type, description } = req.body;
    if (typeof amount !== "number") return res.status(400).json({ error: "invalid_amount" });
    const entry = await LedgerService.createManualEntry({ walletId, bookingId, amount: Number(amount), type, description });
    res.json({ ok: true, entry });
  })
);

export default router;
