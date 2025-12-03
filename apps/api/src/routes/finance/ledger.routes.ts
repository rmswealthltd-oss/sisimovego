import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";
import { LedgerService } from "../../modules/finance/ledger.service";
import { LedgerType } from "@prisma/client";

const router = Router();

/**
 * GET /api/finance/ledger
 * Query params: page, pageSize, walletId, bookingId, type, from, to
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { page, pageSize, walletId, bookingId, type, from, to } = req.query;

    const result = await LedgerService.query({
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 50,
      walletId: walletId ? String(walletId) : undefined,
      entityId: bookingId ? String(bookingId) : undefined, // bookingId maps to entityId
      type:
        type && Object.values(LedgerType).includes(type as LedgerType)
          ? (type as LedgerType)
          : undefined,
      from: from ? String(from) : undefined,
      to: to ? String(to) : undefined,
    });

    res.json({ ok: true, entries: result });
  })
);

/**
 * POST /api/finance/ledger
 * Body: { walletId?, bookingId?, amount, type, description }
 */
router.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { walletId, bookingId, amount, type, description } = req.body;

    if (typeof amount !== "number") {
      return res.status(400).json({ error: "invalid_amount" });
    }

    if (!type || !Object.values(LedgerType).includes(type)) {
      return res.status(400).json({ error: "invalid_type" });
    }

    const entry = await LedgerService.createManualEntry({
      walletId,
      bookingId,
      amount,
      type,
      description,
    });

    res.json({ ok: true, entry });
  })
);

export default router;
