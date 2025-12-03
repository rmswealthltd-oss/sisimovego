import prisma from "../../db";
import { getIO } from "../../socket";
import { DriverLocation } from "@prisma/client";
import { haversineDistance } from "../../lib/haversine";

export const DriverLocationService = {
  /**
   * Upsert a driver's location and broadcast via Socket.IO
   */
  async updateDriverLocation(
    driverId: string,
    lat: number,
    lon: number,
    bearing?: number,
    speed?: number
  ): Promise<DriverLocation> {
    const loc = await prisma.driverLocation.upsert({
      where: { driverId },
      create: { driverId, lat, lon, bearing: bearing ?? null, speed: speed ?? null, isActive: true },
      update: { lat, lon, bearing: bearing ?? null, speed: speed ?? null, isActive: true, updatedAt: new Date() },
    });

    try {
      getIO().to(`driver_${driverId}`).emit("location_update", { driverId, lat, lon, bearing, speed });
    } catch {
      // ignore socket errors
    }

    return loc;
  },

  /**
   * Deactivate a driver's location
   */
  async deactivateDriver(driverId: string): Promise<DriverLocation | null> {
    try {
      return await prisma.driverLocation.update({
        where: { driverId },
        data: { isActive: false },
      });
    } catch {
      return null;
    }
  },

  /**
   * Get all active drivers within a given radius (km)
   */
  async getNearbyDrivers(lat: number, lon: number, radiusKm = 10): Promise<DriverLocation[]> {
    const drivers = await prisma.driverLocation.findMany({ where: { isActive: true } });

    return drivers.filter(d => {
      const dist = haversineDistance([lat, lon], [d.lat, d.lon]);
      return dist <= radiusKm;
    });
  },
};
