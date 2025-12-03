// src/modules/trips/trip.service.ts
import prisma from "../../db";
import { getIO } from "../../socket";

export const TripService = {
  async createTrip(
    ownerId: string,
    driverId: string,
    data: {
      fromLocation: string;
      toLocation: string;
      date: Date;
      totalSeats: number;
      pricePerSeat: number;
      notes?: string;
    }
  ) {
    const trip = await prisma.trip.create({
      data: {
        ownerId,
        driverId,
        fromLocation: data.fromLocation,
        toLocation: data.toLocation,
        date: data.date,
        totalSeats: data.totalSeats,
        availableSeats: data.totalSeats,
        pricePerSeat: data.pricePerSeat,
        notes: data.notes ?? null,
      },
    });

    await prisma.outboxEvent.create({
      data: {
        aggregateType: "Trip",
        aggregateId: trip.id,
        type: "TripCreated",
        payload: JSON.stringify({ tripId: trip.id }),
        channel: "pubsub",
        status: "READY",
      },
    }).catch(() => null);

    return trip;
  },

  async getTrip(tripId: string) {
    return prisma.trip.findUnique({ where: { id: tripId } });
  },

  async listTrips(filters: { fromLocation?: string; toLocation?: string; from?: Date; to?: Date; limit?: number } = {}) {
    const where: any = {};
    if (filters.fromLocation) where.fromLocation = filters.fromLocation;
    if (filters.toLocation) where.toLocation = filters.toLocation;
    if (filters.from || filters.to) {
      where.date = {};
      if (filters.from) where.date.gte = filters.from;
      if (filters.to) where.date.lte = filters.to;
    }

    return prisma.trip.findMany({
      where,
      orderBy: { date: "asc" },
      take: filters.limit ?? 50,
    });
  },

  async updateTrip(
    tripId: string,
    updates: Partial<{
      fromLocation: string;
      toLocation: string;
      date: Date;
      totalSeats: number;
      availableSeats: number;
      pricePerSeat: number;
      notes: string;
    }>
  ) {
    return prisma.trip.update({
      where: { id: tripId },
      data: updates,
    });
  },

  async cancelTrip(tripId: string, reason?: string) {
    await prisma.trip.update({
      where: { id: tripId },
      data: { canceledAt: new Date(), cancelReason: reason ?? null, status: "CANCELLED" },
    });

    try {
      await prisma.$transaction(async (tx) => {
        const bookings = await tx.booking.findMany({ where: { tripId, status: { not: "CANCELLED" } } });
        let totalSeatsToReturn = 0;

        for (const b of bookings) {
          totalSeatsToReturn += b.seats;
          await tx.booking.update({ where: { id: b.id }, data: { status: "CANCELLED" } });
        }

        if (totalSeatsToReturn > 0) {
          await tx.trip.updateMany({
            where: { id: tripId },
            data: { availableSeats: { increment: totalSeatsToReturn } },
          });
        }
      });
    } catch {}

    return { ok: true };
  },

  // -----------------------------
  // New methods for admin ops
  // -----------------------------
  async restartTrip(tripId: string) {
    return prisma.trip.update({
      where: { id: tripId },
      data: { status: "ACTIVE", canceledAt: null, cancelReason: null },
    });
  },

  async forceComplete(tripId: string) {
    return prisma.trip.update({
      where: { id: tripId },
      data: { status: "COMPLETED", endedAt: new Date() },
    });
  },
};
