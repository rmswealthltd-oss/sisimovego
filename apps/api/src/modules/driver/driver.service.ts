// src/modules/driver/driver.service.ts
import prisma from "../../db";
import bcrypt from "bcrypt";

export const DriverService = {
  async createDriver(data: {
    phone: string;
    name: string;
    password: string;
    vehicleModel?: string;
    vehiclePlate?: string;
  }) {
    const hashed = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        phone: data.phone,
        name: data.name,
        role: "driver",
        password: hashed,
        vehicleModel: data.vehicleModel ?? null,
        vehiclePlate: data.vehiclePlate ?? null
      }
    });
  },

  async getDriver(driverId: string) {
    return prisma.user.findUnique({
      where: { id: driverId },
      include: {
        trips: true
      }
    });
  },

  async updateDriver(driverId: string, data: any) {
    return prisma.user.update({
      where: { id: driverId },
      data
    });
  },

  async listDrivers() {
    return prisma.user.findMany({
      where: { role: "driver" },
      orderBy: { createdAt: "desc" },
      take: 200
    });
  }
};
