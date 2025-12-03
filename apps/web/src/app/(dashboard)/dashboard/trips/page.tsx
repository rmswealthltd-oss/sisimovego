"use client";

import Link from "next/link";
import { FiPlus, FiSearch } from "react-icons/fi";

export default function TripsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Trips</h1>

        <Link
          href="/dashboard/trips/post"
          className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90"
        >
          <FiPlus size={18} /> Post a Trip
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow border flex items-center gap-3">
        <FiSearch size={22} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by origin, destination, or date..."
          className="w-full border-none focus:ring-0"
        />
      </div>

      {/* Placeholder — later replaced with TripCard fetch */}
      <div className="text-gray-500 text-center py-10 border rounded-xl bg-gray-50">
        Trip listings will load here…
      </div>
    </div>
  );
}
