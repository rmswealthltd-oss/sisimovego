"use client";

import { FiMapPin, FiCalendar, FiUsers, FiCreditCard } from "react-icons/fi";

interface JoinTripPageProps {
  tripId?: string;
}

export default function JoinTripPage({ tripId }: JoinTripPageProps) {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Join Trip</h1>

      {/* TRIP DETAILS CARD */}
      <div className="card space-y-4">
        <p className="text-gray-600 text-sm">Trip ID: {tripId ?? "—"}</p>

        <div className="flex items-center gap-2 text-lg font-semibold">
          <FiMapPin /> Nairobi → Kisumu
        </div>

        <p className="flex items-center gap-2 text-gray-600">
          <FiCalendar /> 14 Feb 2025 – 08:00 AM
        </p>

        <p className="flex items-center gap-2 text-gray-600">
          <FiUsers /> Seats Available: 3
        </p>

        <p className="flex items-center gap-2 font-medium text-primary">
          <FiCreditCard /> Price: KES 1,200
        </p>
      </div>

      {/* BOOKING FORM */}
      <form className="card space-y-6">
        <div>
          <label className="font-medium text-gray-700">Seats</label>
          <input type="number" min={1} max={3} className="" defaultValue={1} />
        </div>

        <button
          type="submit"
          className="w-full bg-secondary text-white py-3 rounded-xl font-medium hover:bg-secondary/90"
        >
          Request to Join Trip
        </button>
      </form>
    </div>
  );
}
