"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPicker({
  onSelect,
}: {
  onSelect: (date: Date) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  const daysInMonth = new Date(
    year,
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstWeekday = new Date(year, currentMonth.getMonth(), 1).getDay();

  // Build dates grid
  const dates: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) dates.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(new Date(year, currentMonth.getMonth(), d));
  }

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );

  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  const isToday = (d: Date) =>
    today.toDateString() === d.toDateString();

  return (
    <div className="bg-white rounded-2xl p-5 shadow border max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100">
          <ChevronLeft size={18} />
        </button>

        <h2 className="font-semibold text-lg">
          {monthName} {year}
        </h2>

        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Week labels */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {dates.map((d, idx) =>
          d ? (
            <button
              key={idx}
              onClick={() => onSelect(d)}
              className={`py-2 rounded-xl transition ${
                isToday(d)
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {d.getDate()}
            </button>
          ) : (
            <div key={idx} className="py-2"></div>
          )
        )}
      </div>
    </div>
  );
}
