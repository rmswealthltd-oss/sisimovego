"use client";

import { FiMapPin } from "react-icons/fi";

export interface TripFilterValues {
  origin: string;
  destination: string;
  date: string;
}

interface Props {
  filters: TripFilterValues;
  onChange: (filters: TripFilterValues) => void;
}

export default function TripFilterBar({ filters, onChange }: Props) {
  const handleChange = (field: keyof TripFilterValues, value: string) => {
    onChange({
      ...filters, // keep existing values
      [field]: value, // update only the changed field
    });
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow border grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Origin */}
      <div className="relative">
        <FiMapPin className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Origin"
          className="pl-10 w-full"
          value={filters.origin}
          onChange={(e) => handleChange("origin", e.target.value)}
        />
      </div>

      {/* Destination */}
      <div className="relative">
        <FiMapPin className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Destination"
          className="pl-10 w-full"
          value={filters.destination}
          onChange={(e) => handleChange("destination", e.target.value)}
        />
      </div>

      {/* Date */}
      <div>
        <input
          type="date"
          className="w-full"
          value={filters.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
      </div>
    </div>
  );
}
