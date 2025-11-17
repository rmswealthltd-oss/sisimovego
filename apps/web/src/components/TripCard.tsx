// apps/web/components/TripCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { TripView } from "../../types/trip";
import { moneyFromCents } from "@/lib/money";
import { ClockIcon, UserIcon } from "@heroicons/react/24/solid";
import * as TripUtils from "@/utils/trip";

export default function TripCard({ trip }: { trip: TripView }) {
  // Dev-only debug to validate date data
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("TripCard date check:", {
      id: trip.id,
      departureAt: trip.departureAt,
      arrivalAt: trip.arrivalAt,
      parsedDeparture: TripUtils.tripShortTime(trip.departureAt),
      parsedArrival: TripUtils.tripShortTime(trip.arrivalAt),
    });
  }

  const departure = TripUtils.tripShortTime(trip.departureAt);
  const arrival =
    trip.arrivalAt ? TripUtils.tripShortTime(trip.arrivalAt) : null;

  return (
    <Link
      href={`/trip/${trip.id}`}
      className="block bg-white dark:bg-gray-900 rounded-xl shadow p-4 border dark:border-gray-700 hover:shadow-lg transition"
    >
      {/* TITLE */}
      <div className="text-xl font-semibold mb-1">
        {TripUtils.tripRouteLabel(trip.origin, trip.destination)}
      </div>

      {/* TIME */}
      <div className="flex items-center text-gray-600 dark:text-gray-300 gap-2">
        <ClockIcon className="w-4 h-4" />
        <span>
          {departure}
          {arrival && <> → {arrival}</>}
        </span>
      </div>

      {/* DRIVER */}
      <div className="flex items-center text-gray-600 dark:text-gray-300 gap-2 mt-1">
        <UserIcon className="w-4 h-4" />
        <span>{trip.driverName || "Driver"}</span>
      </div>

      {/* PRICE */}
      <div className="mt-4 text-lg font-bold text-blue-600 dark:text-blue-400">
        {moneyFromCents(trip.priceCents)}
      </div>
    </Link>
  );
}
