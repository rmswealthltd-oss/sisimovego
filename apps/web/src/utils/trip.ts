// apps/web/src/utils/trip.ts

import { format } from "date-fns";
import { TripView } from "@/types/trip";
import { TripStatusLabels, TripStatusColors } from "@/constants/tripStatus";
import { moneyFromCents } from "@/lib/money";

/**
 * ===============
 * SAFE DATE UTILS
 * ===============
 */

export function safeDate(input: any): Date | null {
  if (!input) return null;

  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) return null;
    return d;
  } catch {
    return null;
  }
}

export function formatDate(input: any, pattern: string, fallback = "—") {
  const d = safeDate(input);
  if (!d) return fallback;

  try {
    return format(d, pattern);
  } catch {
    return fallback;
  }
}

/**
 * ===============
 * TIME HELPERS
 * ===============
 */

export function tripShortTime(input?: string | Date | null): string {
  return formatDate(input, "HH:mm", "—");
}

export function tripTime(input?: string | Date | null): string {
  return formatDate(input, "dd MMM yyyy, HH:mm", "—");
}

/**
 * ===============
 * ROUTE + FARE
 * ===============
 */

export function tripRouteLabel(origin?: string, destination?: string) {
  const o = origin?.trim() || "Unknown";
  const d = destination?.trim() || "Unknown";
  return `${o} → ${d}`;
}

export function tripFare(cents: number) {
  return moneyFromCents(cents);
}

/**
 * ===============
 * STATUS HELPERS
 * ===============
 */

export function tripStatusLabel(status: string) {
  return TripStatusLabels[status as keyof typeof TripStatusLabels] || "Unknown";
}

export function tripStatusColor(status: string) {
  return TripStatusColors[status as keyof typeof TripStatusColors] || "gray";
}

export function isTripCompleted(status: string) {
  return status === "COMPLETED";
}

export function isTripActive(status: string) {
  return status === "DRIVER_ASSIGNED" || status === "ONGOING";
}

/**
 * ===============
 * SEATS
 * ===============
 */

export function seatsAvailable(total: number, booked: number) {
  return Math.max(0, total - booked);
}

export function isSeatAvailable(total: number, booked: number) {
  return seatsAvailable(total, booked) > 0;
}
