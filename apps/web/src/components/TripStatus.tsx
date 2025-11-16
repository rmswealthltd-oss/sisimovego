// apps/web/src/components/TripStatus.tsx
"use client";

import clsx from "@/utils/clsx";

interface Props {
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  REQUESTING: "bg-yellow-100 text-yellow-700 border-yellow-300",
  DRIVER_ASSIGNED: "bg-blue-100 text-blue-700 border-blue-300",
  DRIVER_ARRIVING: "bg-indigo-100 text-indigo-700 border-indigo-300",
  IN_PROGRESS: "bg-teal-100 text-teal-700 border-teal-300",
  COMPLETED: "bg-green-100 text-green-700 border-green-300",
  CANCELLED: "bg-red-100 text-red-700 border-red-300",
};

export default function TripStatus({ status }: Props) {
  return (
    <div
      className={clsx(
        "inline-block px-3 py-1 rounded border text-xs font-medium",
        STATUS_COLORS[status] || "bg-gray-100 text-gray-700 border-gray-300"
      )}
    >
      {status.replace("_", " ")}
    </div>
  );
}
