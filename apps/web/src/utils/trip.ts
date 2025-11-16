// apps/web/src/utils/trip.ts

import { TripStatus, TripStatusLabels, TripStatusColors } from "@/constants/tripStatus";
import { Money } from "@/lib/money";
import { DateFmt } from "@/lib/date";

// Format trip: origin → destination
export function tripRouteLabel(origin: string, destination: string) {
  return `${origin} → ${destination}`;
}

// Format fare (KES)
export function tripFare(cents: number) {
  return Money.format(cents);
}

// Human-friendly date/time
export function tripTime(date: string | Date) {
  return DateFmt.short(date);
}

export function tripStatusLabel(status: string) {
  return TripStatusLabels[status as keyof typeof TripStatusLabels] || "Unknown";
}

export function tripStatusColor(status: string) {
  return TripStatusColors[status as keyof typeof TripStatusColors] || "gray";
}

// Check if trip is completed
export function isTripCompleted(status: string) {
  return status === TripStatus.COMPLETED;
}

// Check if trip is active / ongoing
export function isTripActive(status: string) {
  return (
    status === TripStatus.ASSIGNED ||
    status === TripStatus.STARTED ||
    status === TripStatus.ARRIVED
  );
}

// Seat helpers
export function seatsAvailable(total: number, booked: number) {
  return total - booked;
}

export function isSeatAvailable(total: number, booked: number) {
  return seatsAvailable(total, booked) > 0;
}
