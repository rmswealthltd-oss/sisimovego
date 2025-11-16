// src/modules/bookings/booking.service.ts
import prisma from "../../db";
import { sendMpesaSTK } from "../../lib/sendMpesaPay";
import { getIO } from "../../socket";

/**
 * BookingService
 *
 * Responsibilities:
 * - Atomic seat reservation (DB-level conditional update)
 * - Idempotency by providerTxId or idempotencyKey
 * - Persist booking, ledger reserve row, and outbox event in a single transaction
 * - Optionally initiate payment (MPESA/STRIPE) or return instructions for pay-on-pickup
 * - Emit socket events to driver/trip rooms when booking created/changed
 */

export const BookingService = {
  /**
   * Create a booking atomically.
   * payload: { tripId, passengerId, seats, paymentMethod?: 'MPESA'|'STRIPE'|'ON_PICKUP', idempotencyKey?, phone? }
   */
  async createBooking(payload: {
    tripId: string;
    passengerId: string;
    seats?: number;
    paymentMethod?: string;
    idempotencyKey?: string | null;
    providerTxId?: string | null;
    phone?: string | null;
  }) {
    const seatsNum = Number(payload.seats ?? 1);
    if (seatsNum < 1) throw new Error("invalid_seats");

    // top-level atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1) Idempotency checks
      if (payload.providerTxId) {
        const existing = await tx.booking.findUnique({ where: { providerTxId: payload.providerTxId } }).catch(() => null);
        if (existing) return { already: true, booking: existing };
      }
      if (payload.idempotencyKey) {
        const existing = await tx.booking.findUnique({ where: { idempotencyKey: payload.idempotencyKey } }).catch(() => null);
        if (existing) return { already: true, booking: existing };
      }

      // 2) Load trip & compute fare
      const trip = await tx.trip.findUnique({ where: { id: payload.tripId } });
      if (!trip) throw new Error("trip_not_found");

      if (trip.seatsAvailable < seatsNum) throw new Error("not_enough_seats");

      // 3) Conditional seat decrement — use raw UPDATE for atomicity
      const updated = await tx.$executeRawUnsafe(
        `UPDATE "Trip" SET "seatsAvailable" = "seatsAvailable" - $1
         WHERE id = $2 AND "seatsAvailable" >= $1`,
        seatsNum,
        payload.tripId
      );
      if (!updated || updated === 0) throw new Error("not_enough_seats");

      // 4) Compute amounts (pricePerSeat stored in cents)
      const amountCents = (trip.pricePerSeat ?? 0) * seatsNum;

      // 5) Create booking record
      const booking = await tx.booking.create({
        data: {
          tripId: payload.tripId,
          passengerId: payload.passengerId,
          seats: seatsNum,
          status: payload.paymentMethod === "ON_PICKUP" ? "CONFIRMED" : "PENDING",
          provider: payload.paymentMethod ?? "MPESA",
          providerTxId: payload.providerTxId ?? null,
          idempotencyKey: payload.idempotencyKey ?? null,
          amountPaid: 0
        }
      });

      // 6) Ledger reserve row (temporary hold)
      await tx.ledger.create({
        data: {
          bookingId: booking.id,
          amount: 0, // zero until paid; you may opt to reserve fee
          type: "BOOKING_RESERVE",
          description: `Reserve for booking ${booking.id}`
        }
      });

      // 7) Outbox: booking created
      await tx.outbox.create({
        data: {
          aggregateType: "Booking",
          aggregateId: booking.id,
          type: "BookingCreated",
          payload: JSON.stringify({ bookingId: booking.id, tripId: booking.tripId, passengerId: booking.passengerId }),
          channel: "pubsub",
          status: "READY"
        }
      });

      // 8) If payment method requires immediate initiation (e.g. MPESA), do an initiation record (but avoid external calls inside TX)
      // We'll create a PaymentCallback placeholder row for idempotency tracking if providerTxId exists
      if (payload.providerTxId) {
        await tx.paymentCallback.create({
          data: {
            provider: payload.paymentMethod ?? "MPESA",
            providerTxId: payload.providerTxId,
            rawPayload: {},
            status: "PENDING"
          }
        }).catch(() => null);
      }

      return { booking, amountCents };
    }); // end transaction

    // 9) After commit: if paymentMethod is MPESA and phone provided, initiate STK asynchronously (outside transaction)
    if (!(result as any).already) {
      const out = result as any;
      if (payload.paymentMethod === "MPESA" && payload.phone) {
        // initiate STK push (external call)
        try {
          const mpesa = await sendMpesaSTK({ phone: payload.phone, amount: (out.amountCents ?? 0) / 100, accountRef: out.booking.id });
          // attach providerTxId to booking (best-effort)
          await prisma.booking.update({
            where: { id: out.booking.id },
            data: { providerTxId: mpesa.providerTxId }
          }).catch(() => null);

          // record PaymentCallback row if not exists
          await prisma.paymentCallback.create({
            data: { provider: "MPESA", providerTxId: mpesa.providerTxId, rawPayload: mpesa.raw ?? {}, status: "PENDING" }
          }).catch(() => null);
        } catch (err) {
          console.error("mpesa initiation failed", err);
        }
      }

      // emit socket event to trip room and potentially driver
      try {
        const io = getIO();
        io.to(`trip_${(result as any).booking.tripId}`).emit("booking_created", { bookingId: (result as any).booking.id });
        io.to(`driver_${(result as any).booking.tripId}`).emit("booking_created", { bookingId: (result as any).booking.id });
      } catch (e) {
        // ignore socket errors
      }
    }

    return result;
  },

  /**
   * Reconcile payment for a booking (called by payment callback flow)
   * - Marks booking PAID
   * - Credits ESCROW wallet
   * - Creates ledger entries
   * - Emits BookingPaid outbox event
   */
  async reconcilePayment({ bookingId, providerTxId, amountCents }: { bookingId: string; providerTxId: string; amountCents: number }) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!booking) throw new Error("booking_not_found");

      if (booking.status === "PAID") {
        return booking;
      }

      // mark booking paid
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "PAID", amountPaid: amountCents, providerTxId }
      });

      // ensure escrow wallet
      let escrow = await tx.wallet.findFirst({ where: { ownerId: null, type: "ESCROW" } });
      if (!escrow) {
        escrow = await tx.wallet.create({ data: { ownerId: null, type: "ESCROW", balance: 0 } });
      }

      // credit escrow
      await tx.wallet.update({
        where: { id: escrow.id },
        data: { balance: { increment: amountCents } }
      });

      // ledger: booking payment
      await tx.ledger.create({
        data: {
          bookingId,
          walletId: escrow.id,
          amount: amountCents,
          type: "BOOKING_PAYMENT",
          description: `Payment received for booking ${bookingId} providerTx=${providerTxId}`
        }
      });

      // outbox: BookingPaid
      await tx.outbox.create({
        data: {
          aggregateType: "Booking",
          aggregateId: bookingId,
          type: "BookingPaid",
          payload: JSON.stringify({ bookingId, providerTxId, amount: amountCents }),
          channel: "pubsub",
          status: "READY"
        }
      });

      return await tx.booking.findUnique({ where: { id: bookingId } });
    });
  },

  /**
   * Cancel booking: refund logic is separate. This marks booking CANCELLED and increments seatsAvailable.
   * Use transaction to undo seat decrement safely.
   */
  async cancelBooking({ bookingId, reason }: { bookingId: string; reason?: string }) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!booking) throw new Error("booking_not_found");

      if (booking.status === "CANCELLED") return booking;

      // update booking status
      await tx.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });

      // increment trip seats
      await tx.trip.updateMany({
        where: { id: booking.tripId },
        data: { seatsAvailable: { increment: booking.seats } }
      });

      await tx.outbox.create({
        data: {
          aggregateType: "Booking",
          aggregateId: bookingId,
          type: "BookingCancelled",
          payload: JSON.stringify({ bookingId, reason }),
          channel: "pubsub",
          status: "READY"
        }
      });

      return booking;
    });
  }
};
