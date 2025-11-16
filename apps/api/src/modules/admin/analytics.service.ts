// src/modules/admin/analytics.service.ts
import prisma from "../../db";

export const AnalyticsService = {
  async getOverview() {
    const [users, drivers, trips, bookings, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.driver.count(),
      prisma.trip.count(),
      prisma.booking.count(),
      prisma.ledger.aggregate({
        _sum: { amount: true },
        where: { type: "BOOKING_PAYMENT" }
      })
    ]);

    return {
      users,
      drivers,
      trips,
      bookings,
      revenueCents: revenue._sum.amount ?? 0
    };
  },

  async revenueSeries() {
    const rows = await prisma.$queryRawUnsafe(`
      SELECT date_trunc('day', "createdAt") AS day,
             SUM(amount) AS total
      FROM "Ledger"
      WHERE type = 'BOOKING_PAYMENT'
      GROUP BY 1
      ORDER BY 1 ASC
    `);

    return rows;
  },

  async tripMetrics() {
    const rows = await prisma.$queryRawUnsafe(`
      SELECT date_trunc('day', "createdAt") AS day,
             COUNT(*) FILTER (WHERE status = 'COMPLETED') AS completed,
             COUNT(*) FILTER (WHERE status = 'CANCELLED') AS cancelled,
             COUNT(*) AS total
      FROM "Trip"
      GROUP BY 1
      ORDER BY 1 ASC
    `);

    return rows;
  }
};
