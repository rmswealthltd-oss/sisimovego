// src/modules/trips/driverLocation.service.ts
import prisma from "../../db";
import { getIO } from "../../socket";

/**
 * DriverLocationService:
 * - upsert driver location
 * - mark active/inactive
 * - broadcast via socket.io
 */

export const DriverLocationService = {
  async updateDriverLocation(driverId: string, lat: number, lon: number, bearing?: number, speed?: number) {
    const loc = await prisma.driverLocation.upsert({
      where: { driverId },
      create: { driverId, lat, lon, bearing: bearing ?? null, speed: speed ?? null, isActive: true },
      update: { lat, lon, bearing: bearing ?? null, speed: speed ?? null, isActive: true, updatedAt: new Date() }
    });

    try {
      const io = getIO();
      io.to(`driver_${driverId}`).emit("location_update", { driverId, lat, lon, bearing, speed });
    } catch (e) {
      // ignore
    }

    return loc;
  },

  async deactivateDriver(driverId: string) {
    try {
      return prisma.driverLocation.update({ where: { driverId }, data: { isActive: false } });
    } catch (e) {
      return null;
    }
  },

  async getNearbyDrivers(lat: number, lon: number, radiusKm = 10) {
    const drivers = await prisma.driverLocation.findMany({ where: { isActive: true } });
    // filter by distance
    return drivers.filter((d: any) => {
      const dist = require("../../lib/haversine").haversineDistance([lat, lon], [d.lat, d.lon]);
      return dist <= radiusKm;
    });
  }
};
