import prisma from "../../db";
import _bcrypt from "bcrypt";

export const DriverService = {
  /**
   * Automatically create driver record when license becomes VERIFIED.
   */
  async ensureDriverRecord(userId: string) {
    return prisma.driver.upsert({
      where: { userId },
      update: {},
      create: { userId }
    });
  },

  /**
   * System step: mark license as verified → create Driver row (if missing)
   */
  async verifyDriverLicense(userId: string) {
    // Set user license verified
    await prisma.user.update({
      where: { id: userId },
      data: { driverLicenseStatus: "APPROVED" }
    });

    // Ensure Driver record exists
    return this.ensureDriverRecord(userId);
  },

  /**
   * Admin or automated verification of the Driver profile.
   * Required to post trips.
   */
  async setDriverVerified(userId: string, verified: boolean) {
    const driver = await prisma.driver.findUnique({ where: { userId } });
    if (!driver) throw new Error("driver_not_found");

    return prisma.driver.update({
      where: { userId },
      data: { verified }
    });
  },

  /**
   * Get driver profile with user & trips.
   */
  async getDriver(userId: string) {
    return prisma.driver.findUnique({
      where: { userId },
      include: {
        user: true,
        trips: true,
        wallet: true,
        payouts: true,
      }
    });
  },

  /**
   * List all drivers.
   */
  async listDrivers() {
    return prisma.driver.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 200
    });
  }
};
