// apps/web/src/components/TripCard.tsx
"use client";

import Link from "next/link";
import { TripView } from "../../types/trip";
import { moneyFromCents } from "@/lib/money";
import { FiMapPin, FiCalendar, FiUsers, FiArrowRight } from "react-icons/fi";
import * as TripUtils from "@/utils/trip";

export default function TripCard({ trip }: { trip: TripView }) {
  const departure = TripUtils.tripShortTime(trip.departureAt);
  const arrival = trip.arrivalAt
    ? TripUtils.tripShortTime(trip.arrivalAt)
    : null;

  return (
    <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {TripUtils.tripRouteLabel(trip.origin, trip.destination)}
        </h2>

        <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-xl">
          {moneyFromCents(trip.priceCents)}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
        <p className="flex items-center gap-2">
          <FiCalendar />
          {departure}
          {arrival && <> → {arrival}</>}
        </p>

        <p className="flex items-center gap-2">
          <FiUsers />
          Seats: {trip.availableSeats ?? "N/A"}
        </p>

        <p className="flex items-center gap-2">
          <FiMapPin />
          Driver: {trip.driverName || "Driver"}
        </p>
      </div>

      <div className="mt-5 flex justify-end">
        <Link
          href={`/trip/${trip.id}`}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          View Trip <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}
