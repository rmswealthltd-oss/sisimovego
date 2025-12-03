// apps/api/types/trip.ts
import type { Trip as PrismaTrip, Booking, Driver, User } from "@prisma/client";

export interface TripView {
  id: string;
  origin: string;
  destination: string;

  originLat: number | null;
  originLng: number | null;
  destLat: number | null;
  destLng: number | null;

  priceCents: number;
  pricePerSeat: number;

  availableSeats: number;
  bookedSeats: number;

  status: string;

  departureAt: string;
  createdAt: string;

  driverId: string | null;
  driverName: string;
}

/**
 * Transform Prisma Trip -> TripView
 */
export function prismaTripToView(
  trip: PrismaTrip & {
    bookings?: (Booking & { seats: number })[];
    driver?: (Driver & { user: User | null }) | null;
  }
): TripView {
  const bookedSeats = Array.isArray(trip.bookings)
    ? trip.bookings.reduce((sum, b) => sum + (b.seats ?? 0), 0)
    : 0;

  const driverName =
    trip.driver?.user
      ? `${trip.driver.user.firstName ?? ""} ${trip.driver.user.lastName ?? ""}`.trim()
      : "Unknown driver";

  return {
    id: trip.id,
    origin: trip.fromLocation,
    destination: trip.toLocation,

    // Lat/Lng not available, default to null
    originLat: null,
    originLng: null,
    destLat: null,
    destLng: null,

    priceCents: trip.pricePerSeat, // you can multiply by totalSeats if needed
    pricePerSeat: trip.pricePerSeat,

    availableSeats: trip.availableSeats,
    bookedSeats,

    status: String(trip.status),

    departureAt: trip.date.toISOString(),
    createdAt: trip.createdAt.toISOString(),

    driverId: trip.driverId,
    driverName,
  };
}
