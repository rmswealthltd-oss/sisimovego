"use client";

import Link from "next/link";
import clsx from "clsx";
import { Money } from "@/lib/money";

export default function TripCard({ trip }: { trip: any }) {
  const dep = new Date(trip?.departureAt || trip?.departure_at);

  const seats =
    trip?.seatsAvailable ??
    trip?.seats_available ??
    0;

  const fare =
    trip?.fareCents ??
    trip?.fare_cents ??
    trip?.price_cents ??
    0;

  const origin =
    trip?.origin?.address ??
    trip?.origin ??
    "Origin";

  const destination =
    trip?.destination?.address ??
    trip?.destination ??
    "Destination";

  return (
    <Link
      href={`/trip/${trip.id}`}
      className="block bg-white rounded-xl shadow hover:shadow-md transition-shadow p-4"
    >
      <div className="flex justify-between gap-4">
        {/* LEFT */}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-500">
            {trip?.operatorName ?? "SisiMove"}
          </div>

          <div className="text-lg font-semibold truncate">
            {origin} → {destination}
          </div>

          <div className="text-sm text-gray-500 truncate">
            {dep.toLocaleString()}
          </div>

          {trip?.shortDescription && (
            <div className="mt-2 text-sm text-gray-600 line-clamp-2">
              {trip.shortDescription}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-end justify-between">
          <div className="text-right">
            <div className="text-xl font-bold">
              {Money.format(fare)}
            </div>
            <div className="text-sm text-gray-500">per seat</div>
          </div>

          <div className="text-right mt-2">
            <div className="text-xs text-gray-500">Seats</div>
            <div
              className={clsx(
                "font-semibold",
                seats > 3
                  ? "text-green-600"
                  : seats > 0
                  ? "text-yellow-600"
                  : "text-red-600"
              )}
            >
              {seats}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
