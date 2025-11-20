"use client";

import clsx from "clsx";

// --------------------------------------
// TYPES
// --------------------------------------
type BookingStatus = "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";

interface EventItem {
  type?: string;
  title?: string;
  message?: string;
  note?: string;
  at?: string | number | Date;
}

interface StepItem {
  label: string;
}

interface BookingTimelineProps {
  events?: EventItem[];
  steps?: StepItem[] | string[];
  currentStep?: number;

  /** booking status from backend */
  status?: BookingStatus;
}

// --------------------------------------
// COMPONENT
// --------------------------------------
export default function BookingTimeline({
  events,
  steps,
  currentStep = 0,
  status,
}: BookingTimelineProps) {
  // ---------------------------------------------------------
  // MODE 1: EVENT TIMELINE (backend events)
  // ---------------------------------------------------------
  if (events && events.length > 0) {
    return (
      <ol className="space-y-3 bg-white p-4 rounded-xl shadow">
        {events.map((e, i) => {
          const title = (e.type || e.title || "Event").replace(/_/g, " ");
          const time = e.at ? new Date(e.at).toLocaleString() : "";

          return (
            <li key={i} className="flex gap-3 items-start">
              <div className="w-3 h-3 rounded-full mt-1 bg-primary" />

              <div className="flex-1">
                <div className="text-sm font-semibold capitalize">{title}</div>

                {e.message || e.note ? (
                  <div className="text-xs text-gray-600">
                    {e.message ?? e.note}
                  </div>
                ) : null}

                {time && (
                  <div className="text-xs text-gray-400 mt-1">{time}</div>
                )}
              </div>

              {i === 0 && (
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  Latest
                </div>
              )}
            </li>
          );
        })}
      </ol>
    );
  }

  // ---------------------------------------------------------
  // MODE 2: STEP TIMELINE (custom static steps)
  // ---------------------------------------------------------
  if (steps && steps.length > 0) {
    return (
      <div className="space-y-4 bg-white p-4 rounded-xl shadow">
        {steps.map((step, i) => {
          const label = typeof step === "string" ? step : step.label;
          const active = i <= currentStep;

          return (
            <div key={i} className="flex items-center gap-3">
              <div
                className={clsx(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                  active ? "bg-primary text-white" : "bg-gray-300 text-gray-700"
                )}
              >
                {i + 1}
              </div>

              <div className={clsx(active && "font-semibold")}>{label}</div>
            </div>
          );
        })}
      </div>
    );
  }

  // ---------------------------------------------------------
  // MODE 3: BOOKING STATUS TIMELINE (your backend enum)
  // ---------------------------------------------------------
  if (status) {
    const flow: BookingStatus[] = [
      "PENDING",
      "PAID",
      "CANCELLED",
      "REFUNDED",
    ];

    const currentIndex = flow.indexOf(status);

    return (
      <div className="space-y-4 bg-white p-4 rounded-xl shadow">
        {flow.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div
              className={clsx(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                i <= currentIndex
                  ? "bg-primary text-white"
                  : "bg-gray-300 text-gray-700"
              )}
            >
              {i + 1}
            </div>

            <div className={clsx(i <= currentIndex && "font-semibold")}>
              {step.toLowerCase().replace(/_/g, " ")}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ---------------------------------------------------------
  // NO DATA
  // ---------------------------------------------------------
  return (
    <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-500">
      No timeline available
    </div>
  );
}
