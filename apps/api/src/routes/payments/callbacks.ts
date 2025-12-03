// apps/api/src/routes/payments/callbacks.ts
import { Router } from "express";
import prisma from "../../db";
import { z } from "zod";

const router = Router();

// -------------------------
// Validate provider payload
// -------------------------
const MpesaCallbackSchema = z.object({
  providerTxId: z.string(),
  amount: z.number(),
  bookingId: z.string().uuid(),
});

// -------------------------
// MPESA Callback
// -------------------------
router.post("/mpesa", async (req, res) => {
  const parse = MpesaCallbackSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid payload", details: parse.error.format() });
  }

  const { providerTxId, amount, bookingId } = parse.data;

  try {
    // 1. Save callback (idempotent)
    await prisma.paymentCallback.create({
      data: {
        provider: "MPESA",
        providerTxId,
        rawPayload: req.body,
        status: "RECEIVED",
      },
    });

    // 2. Find booking
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // 3. Mark booking as PAID
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "PAID",
        amountPaid: Math.round(amount * 100),
        provider: "MPESA",
        providerTxId,
      },
    });

    // 4. Ensure ESCROW wallet exists
    let escrowWallet = await prisma.wallet.findFirst({
      where: { ownerId: null, type: "ESCROW" },
    });

    if (!escrowWallet) {
      escrowWallet = await prisma.wallet.create({
        data: { ownerId: null, type: "ESCROW", balance: 0 },
      });
    }

    // 5. Insert ledger entry
    await prisma.ledger.create({
      data: {
        type: "BOOKING_PAYMENT",          // required LedgerType
        entityType: "BOOKING",
        entityId: bookingId,
        walletId: escrowWallet.id,
        amount: Math.round(amount * 100),
        description: `Payment received for booking ${bookingId}, providerTx=${providerTxId}`,
      },
    });

    // 6. Optional: publish outbox event
    await prisma.outboxEvent.create({
      data: {
        aggregateType: "Booking",
        aggregateId: bookingId,
        type: "PaymentReceived",
        payload: JSON.stringify({ bookingId, providerTxId, amount }),
        channel: "pubsub",
        status: "READY",
      },
    });

    return res.json({ ok: true });
  } catch (e: any) {
    // Handle duplicate callback (idempotency)
    if (e.code === "P2002") {
      return res.status(200).json({ ok: true, idempotent: true });
    }

    console.error("MPESA callback error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
