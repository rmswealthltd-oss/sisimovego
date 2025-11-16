"use client";

import clsx from "clsx";

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
  /** event timeline coming from backend */
  events?: EventItem[];

  /** step timeline for client-driven flows */
  steps?: StepItem[] | string[];

  /** index of current step (0-based) */
  currentStep?: number;
}

export default function BookingTimeline({
  events,
  steps,
  currentStep = 0
}: BookingTimelineProps) {
  // ---------------------------------------------------------
  // MODE 1: EVENT TIMELINE (from backend)
  // ---------------------------------------------------------
  if (events && events.length > 0) {
    return (
      <ol className="space-y-3 bg-white p-4 rounded-xl shadow">
        {events.map((e, i) => {
          const title = (e.type || e.title || "Event").replace(/_/g, " ");
          const time = e.at ? new Date(e.at).toLocaleString() : "";

          return (
            <li key={i} className="flex gap-3 items-start">
              {/* dot */}
              <div className="w-3 h-3 rounded-full mt-1 bg-primary" />

              <div className="flex-1">
                <div className="text-sm font-semibold capitalize">
                  {title}
                </div>
                {e.message || e.note ? (
                  <div className="text-xs text-gray-600">
                    {e.message ?? e.note}
                  </div>
                ) : null}
                {time && (
                  <div className="text-xs text-gray-400 mt-1">{time}</div>
                )}
              </div>

              {/* label for latest */}
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
  // MODE 2: STEP TIMELINE (static UI, e.g. checkout steps)
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
  // NO DATA
  // ---------------------------------------------------------
  return (
    <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-500">
      No timeline available
    </div>
  );
}
