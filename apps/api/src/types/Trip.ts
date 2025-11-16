// src/types/Trip.ts
export type TripStatus = "CREATED" | "STARTED" | "ARRIVED" | "COMPLETED" | "CANCELLED";
export interface TripSummary {
  id: string;
  origin: string;
  destination: string;
  departureAt: string;
  seatsAvailable: number;
  pricePerSeat: number;
}
