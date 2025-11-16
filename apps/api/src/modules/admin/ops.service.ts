// src/modules/admin/ops.service.ts
import prisma from "../../db";

export const OpsService = {
  /**
   * Force-complete a trip:
   * - Update trip.status = COMPLETED
   * - Update all bookings → COMPLETED if paid, CANCELLED otherwise
   * - Write trip audit row
   * - Emit outbox event
   */
  async forceCompleteTrip(tripId: string) {
    return prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id: tripId } });
      if (!trip) throw new Error("trip_not_found");

      await tx.trip.update({
        where: { id: tripId },
        data: { status: "COMPLETED", endedAt: new Date() }
      });

      const bookings = await tx.booking.findMany({ where: { tripId } });

      for (const b of bookings) {
        await tx.booking.update({
          where: { id: b.id },
          data: { status: b.status === "PAID" ? "COMPLETED" : "CANCELLED" }
        });
      }

      await tx.tripStatusAudit.create({
        data: { tripId, status: "ADMIN_FORCE_COMPLETED" }
      });

      await tx.outbox.create({
        data: {
          aggregateType: "Trip",
          aggregateId: tripId,
          type: "TripForceCompleted",
          payload: JSON.stringify({ tripId }),
          channel: "pubsub",
          status: "READY"
        }
      });

      return { ok: true };
    });
  },

  /**
   * Fix corrupted booking:
   * - If paid but booking.status != PAID → fix
   * - If providerTxId exists but no callback → recreate PaymentCallback
   */
  async fixBooking(bookingId: string) {
    return prisma.$transaction(async (tx) => {
      const b = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!b) throw new Error("booking_not_found");

      const fixes: string[] = [];

      // Fix mismatch: payment made but status not PAID
      if (b.amountPaid && b.amountPaid > 0 && b.status !== "PAID") {
        await tx.booking.update({ where: { id: bookingId }, data: { status: "PAID" } });
        fixes.push("status_fixed");
      }

      // If providerTxId but no PaymentCallback row
      if (b.providerTxId) {
        const cb = await tx.paymentCallback.findUnique({ where: { providerTxId: b.providerTxId } });
        if (!cb) {
          await tx.paymentCallback.create({
            data: {
              provider: b.provider ?? "UNKNOWN",
              providerTxId: b.providerTxId,
              rawPayload: {},
              status: "RECEIVED"
            }
          });
          fixes.push("missing_callback_recreated");
        }
      }

      return { ok: true, fixes };
    });
  }
};
