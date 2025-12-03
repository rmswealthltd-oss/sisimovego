import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";
import { sendMpesaSTK } from "../../lib/sendMpesaPay";
import { StripeService } from "../../modules/payments/stripe.service";
import { z } from "zod";
import { validateBody } from "../../middleware/validate";

const router = Router();

/* ------------------- Validation ------------------- */
const initiateSchema = z.object({
  bookingId: z.string().uuid(),
  phone: z.string().regex(/^2547\d{8}$/, "Invalid phone format. Use 2547XXXXXXXX"),
  method: z.enum(["MPESA", "STRIPE"]).optional().default("MPESA"),
});

const mpesaCallbackSchema = z.object({
  providerTxId: z.string().optional(),
  accountReference: z.string().optional(),
  amount: z.number().optional(),
  status: z.string().optional(),
  ResultCode: z.number().optional(),
  TransactionID: z.string().optional(),
});

/* ------------------- Initiate Payment ------------------- */
router.post(
  "/initiate",
  requireAuth,
  validateBody(initiateSchema),
  asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { bookingId, phone, method } = req.body;

    if (!userId) return res.status(401).json({ error: "unauthenticated" });

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return res.status(404).json({ error: "booking_not_found" });

    const trip = await prisma.trip.findUnique({ where: { id: booking.tripId } });
    const amountCents = (trip?.pricePerSeat ?? 0) * booking.seats;

    if (method === "MPESA") {
      const mpesaRes = await sendMpesaSTK({ phone, amount: amountCents / 100, accountRef: bookingId });

      await prisma.paymentCallback.create({
        data: {
          provider: "MPESA",
          providerTxId: mpesaRes.providerTxId,
          rawPayload: mpesaRes.raw ?? {},
          status: "PENDING",
        },
      }).catch((e) => e.code === "P2002" ? null : console.error(e));

      await prisma.booking.update({
        where: { id: bookingId },
        data: { provider: "MPESA", providerTxId: mpesaRes.providerTxId },
      }).catch(() => null);

      return res.json({ provider: "MPESA", providerTxId: mpesaRes.providerTxId, mpesaRes });
    }

    if (method === "STRIPE") {
      const pi = await StripeService.createPaymentIntent({ amountCents });

      await prisma.paymentCallback.create({
        data: { provider: "STRIPE", providerTxId: pi.id, rawPayload: {}, status: "PENDING" },
      }).catch(() => null);

      await prisma.booking.update({
        where: { id: bookingId },
        data: { provider: "STRIPE", providerTxId: pi.id },
      }).catch(() => null);

      return res.json({ provider: "STRIPE", paymentIntent: pi });
    }

    return res.status(400).json({ error: "unsupported_method" });
  })
);

/* ------------------- MPESA Callback ------------------- */
router.post(
  "/mpesa-callback",
  asyncHandler(async (req, res) => {
    const body = req.body;

    const providerTxId = body?.providerTxId || body?.CheckoutRequestID || body?.TransactionID;
    const bookingId = body?.accountReference || body?.invoice || body?.merchantId;
    const rawAmount = body?.amount ?? body?.Amount ?? 0;
    const amount = Number(rawAmount);

    const isSuccess = body?.status === "SUCCESS" || body?.ResultCode === 0 || body?.resultCode === 0;
    const status = isSuccess ? "SUCCESS" : "FAILED";

    if (!providerTxId) return res.status(400).json({ error: "missing_provider_tx_id" });

    // Persist callback
    try {
      await prisma.paymentCallback.create({
        data: { provider: "MPESA", providerTxId, rawPayload: body, status },
      });
    } catch (e: any) {
      if (e.code === "P2002") return res.status(200).json({ ok: true, idempotent: true });
      console.error("callback persist error", e);
      return res.status(500).json({ error: "persist_error" });
    }

    if (!isSuccess) {
      await prisma.outboxEvent.create({
        data: {
          aggregateType: "PaymentCallback",
          aggregateId: providerTxId,
          type: "PaymentFailed",
          payload: JSON.stringify({ providerTxId, body }),
          channel: "pubsub",
          status: "READY",
        },
      });
      return res.status(200).json({ ok: true, status: "FAILED" });
    }

    // Reconcile successful payment
    try {
      await prisma.$transaction(async (tx) => {
        let booking = null;
        if (bookingId) booking = await tx.booking.findUnique({ where: { id: String(bookingId) } }).catch(() => null);
        if (!booking) booking = await tx.booking.findUnique({ where: { providerTxId } }).catch(() => null);

        if (!booking) {
          await tx.dlq.create({ data: { payload: body, reason: "booking_not_found" } });
          return;
        }

        if (booking.status === "PAID") return;

        const paidCents = Math.round(amount * 100);

        await tx.booking.update({ where: { id: booking.id }, data: { status: "PAID", amountPaid: paidCents } });

        let escrow = await tx.wallet.findFirst({ where: { ownerId: null, type: "ESCROW" } });
        if (!escrow) {
          escrow = await tx.wallet.create({ data: { ownerId: null, type: "ESCROW", balance: 0 } });
        }

        await tx.wallet.update({ where: { id: escrow.id }, data: { balance: { increment: paidCents } } });

        await tx.ledger.create({
          data: {
            entityType: "BOOKING",
            entityId: booking.id,
            walletId: escrow.id,
            amount: paidCents,
            type: "BOOKING_PAYMENT",
            description: `Payment received for booking ${booking.id}, providerTx=${providerTxId}`,
          },
        });

        await tx.outboxEvent.create({
          data: {
            aggregateType: "Booking",
            aggregateId: booking.id,
            type: "BookingPaid",
            payload: JSON.stringify({ bookingId: booking.id, providerTxId, amount: paidCents }),
            channel: "pubsub",
            status: "READY",
          },
        });
      });

      return res.status(200).json({ ok: true });
    } catch (err: any) {
      console.error("mpesa callback reconcile error", err);
      return res.status(500).json({ error: "reconcile_failed" });
    }
  })
);

export default router;
