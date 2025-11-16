// src/modules/trips/tripAssignment.service.ts
import prisma from "../../db";
import { haversineDistance } from "../../lib/haversine";

/**
 * TripAssignmentService:
 * - Finds the nearest available driver(s) for a trip origin
 * - Options to expand with scoring factors (rating, acceptance rate)
 */

export const TripAssignmentService = {
  /**
   * Find N nearest active drivers to a lat/lon
   */
  async findNearestDrivers(lat: number, lon: number, limit = 10) {
    // driverLocation model assumed to exist
    const drivers = await prisma.driverLocation.findMany({
      where: { isActive: true },
      take: 500
    });

    const scored = drivers.map((d: any) => {
      const distKm = haversineDistance([lat, lon], [d.lat, d.lon]);
      return { driverLocation: d, distKm };
    });

    scored.sort((a, b) => a.distKm - b.distKm);

    return scored.slice(0, limit);
  },

  /**
   * Assign a driver to a trip (writes trip.driverId and emits events)
   */
  async assignDriverToTrip(tripId: string, driverId: string) {
    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: { driverId }
    });

    // outbox + socket
    await prisma.outbox.create({
      data: {
        aggregateType: "Trip",
        aggregateId: tripId,
        type: "DriverAssigned",
        payload: JSON.stringify({ tripId, driverId }),
        channel: "pubsub",
        status: "READY"
      }
    }).catch(() => null);

    try {
      const io = (await import("../../socket")).getIO();
      io.to(`driver_${driverId}`).emit("assigned_trip", { tripId });
      io.to(`trip_${tripId}`).emit("driver_assigned", { tripId, driverId });
    } catch (e) {
      // ignore socket errors
    }

    return trip;
  }
};
