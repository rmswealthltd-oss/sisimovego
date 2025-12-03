// apps/web/types/trip.ts

export enum Role {
  DRIVER = "DRIVER",
  PASSENGER = "PASSENGER",
}

export enum TripStatus {
  REQUESTING = "REQUESTING",
  PENDING = "PENDING",
  DRIVER_ASSIGNED = "DRIVER_ASSIGNED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export type TripView = {
  id: string;
  ownerId: string; // backend driver/user
  fromLocation: string; // matches backend
  toLocation: string;   // matches backend

  // coordinates
  originLat?: number;
  originLng?: number;
  destLat?: number;
  destLng?: number;

  // pricing & seats
  pricePerSeat: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats?: number;

  // timing
  status: TripStatus;
  departureAt: string; // ISO string
  createdAt: string;
  arrivalAt?: string | null;

  // driver info
  driverId: string;
  driverName?: string;

  notes?: string;
};

export type BookingView = {
  id: string;
  tripId: string;
  passengerId: string;
  seats: number;
  amountCents: number;
  amountPaid: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  provider: "MPESA" | "CARD";
  providerTxId: string | null;
  trip: TripView;
};
