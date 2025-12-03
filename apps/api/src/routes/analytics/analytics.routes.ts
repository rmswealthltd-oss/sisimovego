// apps/api/src/routes/analytics.routes.ts
import { Router, Request, Response } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import prisma from "../../db";

interface AuthUser {
  id: string;
  email: string | null;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  role: "USER" | "DRIVER" | "ADMIN";
}

const router = Router();

/**
 * GET /api/analytics/trips/stats
 * - Admin: returns global stats
 * - Driver: stats for trips they drive
 * - User: stats for their own bookings
 */
router.get(
  "/trips/stats",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as AuthUser;
    if (!user) return res.status(401).json({ error: "unauthorized" });

    let stats;

    if (user.role === "ADMIN") {
      const [
        totalTrips,
        totalBookings,
        totalRevenue,
        pendingBookings,
        completedTrips,
      ] = await Promise.all([
        prisma.trip.count(),
        prisma.booking.count(),
        prisma.booking.aggregate({ _sum: { amountPaid: true } }),
        prisma.booking.count({ where: { status: "PENDING" } }),
        prisma.trip.count({ where: { status: "COMPLETED" } }),
      ]);

      stats = {
        totalTrips,
        totalBookings,
        totalRevenue: totalRevenue?._sum.amountPaid ?? 0,
        pendingBookings,
        completedTrips,
      };
    } else if (user.role === "DRIVER") {
      const [myTrips, myBookings, myRevenue, myPending, myCompleted] = await Promise.all([
        prisma.trip.count({ where: { driverId: user.id } }),
        prisma.booking.count({ where: { trip: { driverId: user.id } } }),
        prisma.booking.aggregate({
          where: { trip: { driverId: user.id } },
          _sum: { amountPaid: true },
        }),
        prisma.booking.count({ where: { trip: { driverId: user.id }, status: "PENDING" } }),
        prisma.trip.count({ where: { driverId: user.id, status: "COMPLETED" } }),
      ]);

      stats = {
        totalTrips: myTrips,
        totalBookings: myBookings,
        totalRevenue: myRevenue?._sum.amountPaid ?? 0,
        pendingBookings: myPending,
        completedTrips: myCompleted,
      };
    } else {
      // regular USER/passenger
      const [myBookings, myRevenue, myPending] = await Promise.all([
        prisma.booking.count({ where: { passengerId: user.id } }),
        prisma.booking.aggregate({ where: { passengerId: user.id }, _sum: { amountPaid: true } }),
        prisma.booking.count({ where: { passengerId: user.id, status: "PENDING" } }),
      ]);

      stats = {
        totalTrips: 0, // optional: user doesn’t have trips
        totalBookings: myBookings,
        totalRevenue: myRevenue?._sum.amountPaid ?? 0,
        pendingBookings: myPending,
        completedTrips: 0,
      };
    }

    return res.json(stats);
  })
);

export default router;
