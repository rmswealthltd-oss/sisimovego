// apps/web/types/trip.ts

export enum TripStatus {
  PENDING = "PENDING",
  DRIVER_ASSIGNED = "DRIVER_ASSIGNED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export type TripView = {
  id: string;
  origin: string;
  destination: string;

  // coordinates
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;

  // pricing & seats
  priceCents: number;
  pricePerSeat: number; // derived on backend
  availableSeats: number;
  bookedSeats: number;

  // timings
  status: TripStatus;
  departureAt: string; // ISO string
  createdAt: string;

  // driver info (resolved)
  driverId: string;
  driverName: string;

  // optional (not in schema but used by UI)
  arrivalAt?: string | null;
};
