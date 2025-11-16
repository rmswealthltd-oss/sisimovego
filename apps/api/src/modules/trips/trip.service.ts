// src/modules/trips/trip.service.ts
import prisma from "../../db";
import { getIO } from "../../socket";

/**
 * TripService: core trip lifecycle & helpers
 *
 * Notes:
 * - Uses optimistic, defensive coding where optional DB models (tripStatusAudit) may not exist.
 * - Emits socket events to trip rooms and driver rooms.
 */

export const TripService = {
  async createTrip(driverId: string, data: {
    origin: string;
    destination: string;
    departureAt: Date;
    seatsTotal: number;
    pricePerSeat: number; // in cents
  }) {
    const trip = await prisma.trip.create({
      data: {
        driverId,
        origin: data.origin,
        destination: data.destination,
        departureAt: data.departureAt,
        seatsTotal: data.seatsTotal,
        seatsAvailable: data.seatsTotal,
        pricePerSeat: data.pricePerSeat
      }
    });

    // outbox event
    await prisma.outbox.create({
      data: {
        aggregateType: "Trip",
        aggregateId: trip.id,
        type: "TripCreated",
        payload: JSON.stringify({ tripId: trip.id }),
        channel: "pubsub",
        status: "READY"
      }
    }).catch(() => null);

    return trip;
  },

  async getTrip(tripId: string) {
    return prisma.trip.findUnique({ where: { id: tripId } });
  },

  async listTrips(filters: { origin?: string; destination?: string; from?: Date; to?: Date; limit?: number } = {}) {
    const where: any = {};
    if (filters.origin) where.origin = filters.origin;
    if (filters.destination) where.destination = filters.destination;
    if (filters.from || filters.to) {
      where.departureAt = {};
      if (filters.from) where.departureAt.gte = filters.from;
      if (filters.to) where.departureAt.lte = filters.to;
    }

    return prisma.trip.findMany({
      where,
      orderBy: { departureAt: "asc" },
      take: filters.limit ?? 50
    });
  },

  async updateTrip(tripId: string, updates: Partial<{ origin: string; destination: string; departureAt: Date; seatsTotal: number; pricePerSeat: number }>) {
    return prisma.trip.update({
      where: { id: tripId },
      data: updates
    });
  },

  /**
   * Set status on a trip and write audit row if available.
   * Status is application-level (not necessarily a DB column in your schema).
   */
  async setStatus(tripId: string, status: string, meta: any = {}) {
    // Try to write a tripStatusAudit entry if model exists; otherwise just emit outbox
    try {
      await prisma.tripStatusAudit.create({
        data: {
          tripId,
          status,
          metadata: meta ? JSON.stringify(meta) : null
        } as any
      });
    } catch (e) {
      // model might not exist — ignore
    }

    // emit outbox and socket
    await prisma.outbox.create({
      data: {
        aggregateType: "Trip",
        aggregateId: tripId,
        type: "TripStatusChanged",
        payload: JSON.stringify({ tripId, status, meta }),
        channel: "pubsub",
        status: "READY"
      }
    }).catch(() => null);

    try {
      const io = getIO();
      io.to(`trip_${tripId}`).emit("trip_status", { tripId, status, meta });
    } catch (e) {
      // ignore socket errors
    }

    return { ok: true };
  },

  async startTrip(tripId: string, driverId?: string) {
    // update any trip-level fields as necessary
    await this.setStatus(tripId, "STARTED", { driverId });
    return { ok: true };
  },

  async arrive(tripId: string, driverId?: string) {
    await this.setStatus(tripId, "ARRIVED", { driverId });
    return { ok: true };
  },

  async completeTrip(tripId: string, driverId?: string) {
    await this.setStatus(tripId, "COMPLETED", { driverId });
    // optional: mark all bookings for trip complete (if paid)
    try {
      await prisma.$transaction(async (tx) => {
        const bookings = await tx.booking.findMany({ where: { tripId } });
        for (const b of bookings) {
          if (b.status === "PAID") {
            await tx.booking.update({ where: { id: b.id }, data: { status: "COMPLETED" } });
          }
        }
      });
    } catch (e) {
      // ignore
    }
    return { ok: true };
  },

  async cancelTrip(tripId: string, reason?: string) {
    await this.setStatus(tripId, "CANCELLED", { reason });
    // return seats to availability for non-cancelled bookings
    try {
      await prisma.$transaction(async (tx) => {
        const bookings = await tx.booking.findMany({ where: { tripId, status: { not: "CANCELLED" } } });
        let totalSeatsToReturn = 0;
        for (const b of bookings) {
          totalSeatsToReturn += b.seats;
          await tx.booking.update({ where: { id: b.id }, data: { status: "CANCELLED" } });
        }

        if (totalSeatsToReturn > 0) {
          await tx.trip.updateMany({ where: { id: tripId }, data: { seatsAvailable: { increment: totalSeatsToReturn } } });
        }
      });
    } catch (e) {
      // ignore
    }
    return { ok: true };
  }
};
