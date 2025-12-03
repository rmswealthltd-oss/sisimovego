"use client";

import { useState } from "react";
import { FiMapPin, FiCalendar, FiUsers, FiCheckCircle } from "react-icons/fi";

export default function PostTripPage() {
  const [approvalMode, setApprovalMode] = useState<"AUTO" | "MANUAL">("AUTO");

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Post a Trip</h1>

      {/* FORM CARD */}
      <form className="card space-y-6">
        {/* ORIGIN */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Origin</label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-400" />
            <input type="text" className="pl-10" placeholder="Nairobi" />
          </div>
        </div>

        {/* DESTINATION */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Destination</label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-400" />
            <input type="text" className="pl-10" placeholder="Mombasa" />
          </div>
        </div>

        {/* DATE + TIME */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Departure Date</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-3 text-gray-400" />
            <input type="datetime-local" className="pl-10" />
          </div>
        </div>

        {/* SEATS */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Available Seats</label>
          <div className="relative">
            <FiUsers className="absolute left-3 top-3 text-gray-400" />
            <input type="number" className="pl-10" min={1} defaultValue={3} />
          </div>
        </div>

        {/* PRICE */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Price (KES)</label>
          <input type="number" className="" min={100} />
        </div>

        {/* APPROVAL MODE */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Approval Mode</label>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setApprovalMode("AUTO")}
              className={`px-4 py-2 rounded-xl border ${
                approvalMode === "AUTO"
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Automatic Approval
            </button>

            <button
              type="button"
              onClick={() => setApprovalMode("MANUAL")}
              className={`px-4 py-2 rounded-xl border ${
                approvalMode === "MANUAL"
                  ? "bg-secondary text-white border-secondary"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Manual Approval
            </button>
          </div>

          {approvalMode === "AUTO" && (
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <FiCheckCircle className="text-primary" /> Passengers will be
              auto-approved after booking.
            </p>
          )}
          {approvalMode === "MANUAL" && (
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <FiCheckCircle className="text-secondary" /> You must manually approve each join request.
            </p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90"
        >
          Post Trip
        </button>
      </form>
    </div>
  );
}
