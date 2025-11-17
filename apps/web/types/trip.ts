// apps/web/types/trip.ts
export type TripView = {
  id: string;
  origin: string;
  destination: string;

  // coords (optional on UI)
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;

  // money & seats
  priceCents: number;
  pricePerSeat: number; // priceCents / 100 (number in main currency)
  availableSeats: number;
  bookedSeats: number; // derived on backend

  // status & times
  status: string; // use TripStatus values (PENDING, DRIVER_ASSIGNED, ONGOING, COMPLETED, CANCELLED)
  departureAt: string; // ISO string sent from backend
  createdAt: string;

  // driver info (resolved)
  driverId: string;
  driverName: string;

  // optional fields for UI
  // arrivalAt doesn't exist in your Prisma schema, but keep optional for future
  arrivalAt?: string | null;
};
