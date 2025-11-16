// apps/api/src/routes/payments/callbacks.ts
import { Router } from "express";
import prisma from "../../db.js";

const router = Router();

router.post("/mpesa", async (req, res) => {
  const { providerTxId, amount, bookingId } = req.body;

  try {
    const saved = await prisma.paymentCallback.create({
      data: { provider: "MPESA", providerTxId, rawPayload: req.body, status: "RECEIVED" }
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      // duplicate providerTxId -> idempotent: already processed
      return res.status(200).json({ ok: true, idempotent: true });
    }
    throw e;
  }

  // Reconcile: mark booking paid, credit escrow wallet, create ledger entries, etc.
  // Insert outbox events if needed.
  res.json({ ok: true });
});
