// apps/web/src/components/SeatSelector.tsx
"use client";

import { useState } from "react";
import clsx from "@/utils/clsx";

interface SeatSelectorProps {
  total: number;
  taken: number[];
  value?: number[];
  onChange: (seats: number[]) => void;
}

export default function SeatSelector({
  total,
  taken,
  value = [],
  onChange,
}: SeatSelectorProps) {
  const [selected, setSelected] = useState<number[]>(value);

  function toggle(n: number) {
    if (taken.includes(n)) return;

    let newSeats;
    if (selected.includes(n)) {
      newSeats = selected.filter((s) => s !== n);
    } else {
      newSeats = [...selected, n];
    }
    setSelected(newSeats);
    onChange(newSeats);
  }

  return (
    <div className="grid grid-cols-4 gap-3 p-4 bg-white rounded-lg shadow">
      {Array.from({ length: total }).map((_, i) => {
        const seat = i + 1;
        const isTaken = taken.includes(seat);
        const isSelected = selected.includes(seat);

        return (
          <button
            key={seat}
            type="button"
            onClick={() => toggle(seat)}
            disabled={isTaken}
            className={clsx(
              "h-12 rounded flex items-center justify-center text-sm border transition",
              isTaken && "bg-red-200 text-red-700 border-red-400 cursor-not-allowed",
              isSelected && "bg-primary text-white border-primary",
              !isTaken && !isSelected && "bg-gray-100 border-gray-300"
            )}
          >
            {seat}
          </button>
        );
      })}
    </div>
  );
}
