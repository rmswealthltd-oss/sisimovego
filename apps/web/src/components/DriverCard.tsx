// apps/web/src/components/DriverCard.tsx
"use client";

import RatingStars from "./RatingStars";

export default function DriverCard({ driver }: { driver: any }) {
  if (!driver) return null;

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shadow-sm flex-shrink-0">
        <img
          src={driver.avatarUrl ?? "/icons/driver.png"}
          alt={driver.name || "Driver"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main */}
      <div className="flex-1">
        <div className="font-medium text-gray-800">
          {driver.name ?? "Driver"}
        </div>

        {/* Vehicle */}
        {driver.vehicle && (
          <div className="text-sm text-gray-500">
            {driver.vehicle.brand} • {driver.vehicle.plate}
          </div>
        )}

        {/* Rating */}
        <div className="mt-1 flex items-center gap-2">
          <RatingStars rating={driver.rating ?? 4.6} />
          <span className="text-xs text-gray-500">
            ({driver.ratingCount ?? 18})
          </span>
        </div>
      </div>

      {/* Phone */}
      {driver.phone && (
        <div className="text-sm text-gray-600 text-right">
          {driver.phone}
        </div>
      )}
    </div>
  );
}
