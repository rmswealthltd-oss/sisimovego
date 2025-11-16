import React from "react";
import { Tag } from "../../components/Tag";

export type TripEvent = {
  type: string;
  at: string | number | Date;
  note?: string;
};

export default function TripTimeline({ events }: { events: TripEvent[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
        <div className="text-gray-600 dark:text-gray-400">No timeline events.</div>
      </div>
    );
  }

  const colorForType = (type: string): string => {
    switch (type) {
      case "driver_assigned":
        return "blue";
      case "trip_started":
        return "green";
      case "trip_cancelled":
        return "red";
      case "driver_arrived":
        return "yellow";
      case "payment_completed":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-200">
        Timeline
      </h3>

      <ul className="border-l border-gray-300 dark:border-gray-700 pl-4 space-y-5">
        {events.map((e, i) => (
          <li key={i} className="relative">
            {/* Bullet point */}
            <div className="absolute -left-2 top-2 w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400"></div>

            {/* Event type tag */}
            <Tag color={colorForType(e.type)}>{e.type.replace("_", " ")}</Tag>

            {/* Time */}
            <div className="text-sm text-gray-500 mt-1">
              {new Date(e.at).toLocaleString()}
            </div>

            {/* Notes */}
            {e.note && (
              <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                {e.note}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
