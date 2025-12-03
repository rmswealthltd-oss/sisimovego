// src/modules/bookings/booking.service.ts
import prisma from "../../db";
import { sendMpesaSTK } from "../../lib/sendMpesaPay";
import { getIO } from "../../socket";

export interface CreateBookingInput {
  tripId: string;
  passengerId: string;
  seats?: number;
  paymentMethod?: "MPESA" | "STRIPE";
  idempotencyKey?: string | null;
  providerTxId?: string | null;
  phone?: string | null;
}

export const BookingService = {
  /**
   * Create a booking atomically.
   */
  async createBooking(payload: CreateBookingInput) {
    const seatsNum = Number(payload.seats ?? 1);
    if (seatsNum < 1) throw new Error("invalid_seats");

    const result = await prisma.$transaction(async (tx) => {
      /** Idempotency by providerTxId */
      if (payload.providerTxId) {
        const existing = await tx.booking.findUnique({
          where: { providerTxId: payload.providerTxId },
        });
        if (existing) return { already: true, booking: existing };
      }

      /** Idempotency by idempotencyKey */
      if (payload.idempotencyKey) {
        const existing = await tx.booking.findUnique({
          where: { idempotencyKey: payload.idempotencyKey },
        });
        if (existing) return { already: true, booking: existing };
      }

      /** Load trip */
      const trip = await tx.trip.findUnique({
        where: { id: payload.tripId },
      });

      if (!trip) throw new Error("trip_not_found");
      if (trip.availableSeats < seatsNum)
        throw new Error("not_enough_seats");

      /** Atomic decrement seats */
      const updated = await tx.$executeRaw`
        UPDATE "Trip"
        SET "availableSeats" = "availableSeats" - ${seatsNum}
        WHERE id = ${payload.tripId} AND "availableSeats" >= ${seatsNum};
      `;
      if (!updated) throw new Error("not_enough_seats");

      /** Compute cost */
      const amountCents = (trip.pricePerSeat ?? 0) * seatsNum;

      /** Create booking */
      const booking = await tx.booking.create({
        data: {
          tripId: payload.tripId,
          passengerId: payload.passengerId,
          seats: seatsNum,
          status: "PENDING",
          provider: payload.paymentMethod ?? "MPESA",
          providerTxId: payload.providerTxId ?? null,
          idempotencyKey: payload.idempotencyKey ?? null,
          amountPaid: 0,
        },
      });

      /**
       * REQUIRED FIX:
       * Ledger now must attach a wallet (ESCROW)
       */
      let escrow = await tx.wallet.findFirst({
        where: { type: "ESCROW", ownerId: null },
      });

      if (!escrow) {
        escrow = await tx.wallet.create({
          data: {
            type: "ESCROW",
            ownerId: null,
            balance: 0,
          },
        });
      }

      /** Ledger entry: booking reserve */
      await tx.ledger.create({
        data: {
          entityType: "BOOKING",
          entityId: booking.id,
          Wallet: { connect: { id: escrow.id } }, // <-- FIXED
          amount: 0,
          type: "BOOKING_RESERVE",
          description: `Reservation for booking ${booking.id}`,
        },
      });

      /** Outbox event */
      await tx.outboxEvent.create({
        data: {
          aggregateType: "Booking",
          aggregateId: booking.id,
          type: "BookingCreated",
          payload: JSON.stringify({
            bookingId: booking.id,
            tripId: booking.tripId,
            passengerId: booking.passengerId,
          }),
          channel: "pubsub",
          status: "READY",
        },
      });

      /** Payment callback placeholder */
      if (payload.providerTxId) {
        await tx.paymentCallback
          .create({
            data: {
              provider: payload.paymentMethod ?? "MPESA",
              providerTxId: payload.providerTxId,
              rawPayload: {},
              status: "PENDING",
            },
          })
          .catch(() => null);
      }

      return { booking, amountCents };
    });

    /**
     * Post-commit side effects
     */
    if (!("already" in result)) {
      const { booking, amountCents } = result;

      /** MPESA STK push */
      if (payload.paymentMethod === "MPESA" && payload.phone) {
        try {
          const mpesa = await sendMpesaSTK({
            phone: payload.phone,
            amount: amountCents / 100,
            accountRef: booking.id,
          });

          await prisma.booking.update({
            where: { id: booking.id },
            data: { providerTxId: mpesa.providerTxId },
          });

          await prisma.paymentCallback
            .create({
              data: {
                provider: "MPESA",
                providerTxId: mpesa.providerTxId,
                rawPayload: mpesa.raw ?? {},
                status: "PENDING",
              },
            })
            .catch(() => null);
        } catch (err) {
          console.error("MPESA STK failed", err);
        }
      }

      /** WebSocket notifications */
      try {
        const io = getIO();

        io.to(`trip_${booking.tripId}`).emit("booking_created", {
          bookingId: booking.id,
        });

        const trip = await prisma.trip.findUnique({
          where: { id: booking.tripId },
          select: { driverId: true },
        });

        if (trip?.driverId) {
          io.to(`driver_${trip.driverId}`).emit("booking_created", {
            bookingId: booking.id,
          });
        }
      } catch {}
    }

    return result;
  },

  /**
   * Reconcile payment, credit escrow, ledger entry
   */
  async reconcilePayment({
    bookingId,
    providerTxId,
    amountCents,
  }: {
    bookingId: string;
    providerTxId: string;
    amountCents: number;
  }) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) throw new Error("booking_not_found");
      if (booking.status === "PAID") return booking;

      /** Mark booking paid */
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "PAID",
          amountPaid: amountCents,
          providerTxId,
        },
      });

      /** Ensure escrow wallet exists */
      let escrow = await tx.wallet.findFirst({
        where: { type: "ESCROW", ownerId: null },
      });

      if (!escrow) {
        escrow = await tx.wallet.create({
          data: { type: "ESCROW", ownerId: null, balance: 0 },
        });
      }

      /** Credit escrow */
      await tx.wallet.update({
        where: { id: escrow.id },
        data: { balance: { increment: amountCents } },
      });

      /** Ledger */
      await tx.ledger.create({
        data: {
          entityType: "BOOKING",
          entityId: bookingId,
          walletId: escrow.id,
          amount: amountCents,
          type: "BOOKING_PAYMENT",
          description: `Payment for booking ${bookingId}, providerTx=${providerTxId}`,
        },
      });

      /** Outbox */
      await tx.outboxEvent.create({
        data: {
          aggregateType: "Booking",
          aggregateId: bookingId,
          type: "BookingPaid",
          payload: JSON.stringify({
            bookingId,
            providerTxId,
            amount: amountCents,
          }),
          channel: "pubsub",
          status: "READY",
        },
      });

      return tx.booking.findUnique({ where: { id: bookingId } });
    });
  },

  /**
   * Cancel booking + release seats
   */
  async cancelBooking({
    bookingId,
    reason,
  }: {
    bookingId: string;
    reason?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) throw new Error("booking_not_found");
      if (booking.status === "CANCELLED") return booking;

      /** Mark cancelled */
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED" },
      });

      /** Restore seats */
      await tx.trip.updateMany({
        where: { id: booking.tripId },
        data: { availableSeats: { increment: booking.seats } },
      });

      /** Outbox */
      await tx.outboxEvent.create({
        data: {
          aggregateType: "Booking",
          aggregateId: bookingId,
          type: "BookingCancelled",
          payload: JSON.stringify({ bookingId, reason }),
          channel: "pubsub",
          status: "READY",
        },
      });

      return booking;
    });
  },
};
