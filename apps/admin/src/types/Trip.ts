export type TripStatus = "CREATED" | "ASSIGNED" | "ENROUTE" | "ARRIVED" | "COMPLETED" | "CANCELLED";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Trip {
  id: string;
  origin: { address: string; lat: number; lng: number };
  destination: { address: string; lat: number; lng: number };
  departureAt: string; // ISO
  arrivalAt?: string; // ISO
  fareCents: number;
  seatsTotal: number;
  seatsAvailable: number;
  driverId?: string | null;
  driver?: any;
  status: TripStatus;
  timeline?: Array<{ type: string; at: string; note?: string }>;
  createdAt: string;
  updatedAt?: string;
}
