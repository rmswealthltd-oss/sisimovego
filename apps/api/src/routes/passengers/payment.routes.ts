// src/routes/passengers/payment.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";
import { sendMpesaSTK } from "../../lib/sendMpesaPay";
import { getSystemEscrowWallet } from "../../modules/payments/escrow.service";
import { PayoutService } from "../../modules/payments/payout.service";
import { StripeService } from "../../modules/payments/stripe.service";

const router = Router();

/**
 * POST /api/passengers/payments/initiate
 * body: { bookingId, phone, method: 'MPESA' | 'STRIPE', idempotencyKey? }
 *
 * Initiates payment (STK push or Stripe paymentIntent).
 * It records providerTxId/pending callback row (if available) and returns provider info.
 */
router.post(
  "/initiate",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = (req as any).user.sub;
    const { bookingId, phone, method = "MPESA", idempotencyKey } = req.body;
    if (!bookingId || !phone) return res.status(400).json({ error: "missing_fields" });

    // load booking and fare
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return res.status(404).json({ error: "booking_not_found" });

    // compute amount (for now use booking.amountPaid or compute from trip)
    const trip = await prisma.trip.findUnique({ where: { id: booking.tripId } });
    const amountCents = (trip?.pricePerSeat ?? 0) * booking.seats;

    if (method === "MPESA") {
      const mpesaRes = await sendMpesaSTK({ phone, amount: amountCents / 100, accountRef: bookingId });

      // store pending payment callback record (idempotent by providerTxId)
      try {
        await prisma.paymentCallback.create({
          data: {
            provider: "MPESA",
            providerTxId: mpesaRes.providerTxId,
            rawPayload: mpesaRes.raw ?? {},
            status: "PENDING"
          }
        });
      } catch (e: any) {
        // if duplicate key, ignore - it means this initiation already recorded
      }

      // attach providerTxId to booking for easier reconciliation if desired (not required)
      await prisma.booking.update({ where: { id: bookingId }, data: { provider: "MPESA", providerTxId: mpesaRes.providerTxId } }).catch(() => {});

      return res.json({ provider: "MPESA", providerTxId: mpesaRes.providerTxId, mpesaRes });
    }

    if (method === "STRIPE") {
      const pi = await StripeService.createPaymentIntent({ amountCents });
      // optionally persist idempotencyKey
      await prisma.paymentCallback.create({
        data: {
          provider: "STRIPE",
          providerTxId: pi.id,
          rawPayload: {},
          status: "PENDING"
        }
      }).catch(() => null);

      await prisma.booking.update({ where: { id: bookingId }, data: { provider: "STRIPE", providerTxId: pi.id } }).catch(() => {});

      return res.json({ provider: "STRIPE", paymentIntent: pi });
    }

    return res.status(400).json({ error: "unsupported_method" });
  })
);

/**
 * POST /api/passengers/payments/mpesa-callback
 * This is the webhook endpoint Safaricom will call.
 * The body should include providerTxId and status and amount and bookingId (if they include)
 *
 * Idempotent handling:
 * - Persist PaymentCallback row with unique providerTxId.
 * - If duplicate, return 200 (already processed).
 * - On success, reconcile booking: mark PAID, credit escrow wallet, create ledger, create outbox event.
 */
router.post(
  "/mpesa-callback",
  asyncHandler(async (req, res) => {
    const body = req.body;
    const providerTxId = body?.providerTxId ?? body?.CheckoutRequestID ?? body?.TransactionID;
    const status = body?.status ?? body?.ResultCode === 0 ? "SUCCESS" : "FAILED";
    const amount = Number(body?.amount ?? body?.Amount ?? 0);
    const bookingId = body?.accountReference ?? body?.invoice ?? null;

    if (!providerTxId) {
      return res.status(400).json({ error: "missing_provider_tx_id" });
    }

    // Persist callback idempotently
    try {
      await prisma.paymentCallback.create({
        data: {
          provider: "MPESA",
          providerTxId,
          rawPayload: body,
          status: status
        }
      });
    } catch (e: any) {
      // If unique constraint violation, it's probably already processed
      // Prisma error code for unique constraint is P2002
      if (e.code === "P2002") {
        return res.status(200).json({ ok: true, idempotent: true });
      }
      console.error("paymentCallback persist error", e);
      return res.status(500).json({ error: "persist_error" });
    }

    if (status !== "SUCCESS") {
      // create outbox record so business can inspect failed payments; do not reconcile booking
      await prisma.outbox.create({
        data: {
          aggregateType: "PaymentCallback",
          aggregateId: providerTxId,
          type: "PaymentFailed",
          payload: JSON.stringify({ providerTxId, body }),
          channel: "pubsub",
          status: "READY"
        }
      });
      return res.status(200).json({ ok: true, status: "FAILED" });
    }

    // Reconcile payment -> mark booking PAID, credit ESCROW wallet, create ledger + outbox, all inside transaction
    try {
      await prisma.$transaction(async (tx) => {
        // find booking: by providerTxId or bookingId (accountReference)
        let booking = null;
        if (bookingId) {
          booking = await tx.booking.findUnique({ where: { id: String(bookingId) } }).catch(() => null);
        }
        if (!booking) {
          booking = await tx.booking.findUnique({ where: { providerTxId } }).catch(() => null);
        }

        if (!booking) {
          // no booking found: create DLQ row for manual reconciliation
          await tx.dlq.create({
            data: {
              source: "PaymentCallback",
              payload: body,
              error: "booking_not_found"
            }
          });
          return;
        }

        if (booking.status === "PAID") {
          // already paid
          return;
        }

        // compute amount to record (use amount param if provided)
        const paidCents = Math.round((amount || (booking.amountPaid ?? 0)) * 100);

        // mark booking paid
        await tx.booking.update({
          where: { id: booking.id },
          data: { status: "PAID", amountPaid: paidCents }
        });

        // ensure system escrow wallet exists
        let escrow = await tx.wallet.findFirst({ where: { ownerId: null, type: "ESCROW" } });
        if (!escrow) {
          escrow = await tx.wallet.create({ data: { ownerId: null, type: "ESCROW", balance: 0 } });
        }

        // credit escrow wallet
        await tx.wallet.update({
          where: { id: escrow.id },
          data: { balance: { increment: paidCents } }
        });

        // ledger entry for booking payment
        await tx.ledger.create({
          data: {
            bookingId: booking.id,
            walletId: escrow.id,
            amount: paidCents,
            type: "BOOKING_PAYMENT",
            description: `Payment received for booking ${booking.id}, providerTx=${providerTxId}`
          }
        });

        // Outbox: BookingPaid event
        await tx.outbox.create({
          data: {
            aggregateType: "Booking",
            aggregateId: booking.id,
            type: "BookingPaid",
            payload: JSON.stringify({ bookingId: booking.id, providerTxId, amount: paidCents }),
            channel: "pubsub",
            status: "READY"
          }
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
