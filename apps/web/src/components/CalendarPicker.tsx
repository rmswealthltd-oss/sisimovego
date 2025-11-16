// apps/web/src/components/CalendarPicker.tsx
"use client";

import { useState } from "react";

interface CalendarPickerProps {
  value?: string;
  onChange: (date: string) => void;
  minDate?: string;
}

export default function CalendarPicker({
  value = "",
  onChange,
  minDate,
}: CalendarPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border rounded px-3 py-2 text-left bg-white"
      >
        {value ? new Date(value).toDateString() : "Pick a date"}
      </button>

      {open && (
        <div className="absolute mt-2 bg-white p-4 shadow-lg rounded z-20 w-64">
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            min={minDate || new Date().toISOString().split("T")[0]}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
