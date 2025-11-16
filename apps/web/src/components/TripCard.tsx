"use client";

import React from "react";
import Link from "next/link";
import { money } from "@/lib/money";
import { format } from "date-fns";
import { MapPinIcon, ClockIcon, UserIcon } from "@heroicons/react/24/solid";
import { trip } from "@/utils/trip";

export default function TripCard({ trip }: { trip: Trip }) {
  const departure = format(new Date(trip.departureTime), "HH:mm");
  const arrival = format(new Date(trip.arrivalTime), "HH:mm");

  return (
    <Link
      href={`/trip/${trip.id}`}
      className="block bg-white dark:bg-gray-900 rounded-xl shadow p-4 border dark:border-gray-700 hover:shadow-lg transition"
    >
      {/* ROUTE */}
      <div className="text-xl font-semibold mb-1">
        {trip.fromCity} → {trip.toCity}
      </div>

      {/* DEPARTURE ROW */}
      <div className="flex items-center text-gray-600 dark:text-gray-300 gap-2">
        <ClockIcon className="w-4 h-4" />
        <span>{departure} → {arrival}</span>
      </div>

      {/* DRIVER */}
      <div className="flex items-center text-gray-600 dark:text-gray-300 gap-2 mt-1">
        <UserIcon className="w-4 h-4" />
        <span>{trip.driverName}</span>
      </div>

      {/* PRICE */}
      <div className="mt-4 text-lg font-bold text-blue-600 dark:text-blue-400">
        {money(trip.price)}  {/* FIXED */}
      </div>
    </Link>
  );
}
