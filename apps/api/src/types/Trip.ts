// apps/api/transformers/trip.ts
import type { PrismaClient, Trip as PrismaTrip } from "@prisma/client";


/**
 * Transform a Prisma Trip record (with includes) into TripView
 *
 * Expected `include` on the prisma query:
 *  include: { driver: { include: { user: true } }, bookings: true }
 *
 * If bookings are not included, bookedSeats will be 0.
 */

export function prismaTripToView(trip: PrismaTrip & { bookings?: any[]; driver?: any }): TripView {
  const bookedSeats = Array.isArray(trip.bookings)
    ? trip.bookings.reduce((sum, b) => sum + (b.seats || 0), 0)
    : 0;

  // driverName resolved via driver.user.name if available
  let driverName = "Unknown driver";
  if (trip.driver && trip.driver.user && trip.driver.user.name) {
    driverName = trip.driver.user.name;
  }

  return {
    id: trip.id,
    origin: trip.origin,
    destination: trip.destination,
    originLat: trip.originLat,
    originLng: trip.originLng,
    destLat: trip.destLat,
    destLng: trip.destLng,
    priceCents: trip.priceCents,
    pricePerSeat: trip.priceCents / 100,
    availableSeats: trip.availableSeats,
    bookedSeats,
    status: String(trip.status),
    departureAt: trip.departureAt.toISOString(),
    createdAt: trip.createdAt.toISOString(),
    driverId: trip.driverId,
    driverName,
    arrivalAt: null,
  };
}

/**
 * Example usage inside an API route:
 *
 * const trip = await prisma.trip.findUnique({
 *   where: { id },
 *   include: {
 *     driver: { include: { user: true } },
 *     bookings: true
 *   }
 * });
 *
 * if (!trip) return notFound();
 * const view = prismaTripToView(trip);
 * return res.json(view);
 */
