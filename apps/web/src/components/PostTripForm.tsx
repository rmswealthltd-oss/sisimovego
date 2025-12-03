"use client";

import { useState } from "react";
import {
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiCreditCard,
  FiCheckCircle,
} from "react-icons/fi";

export interface PostTripFormValues {
  origin: string;
  destination: string;
  date: string;
  seats: number;
  price: number;
  approvalMode: "AUTO" | "MANUAL";
}

interface Props {
  onSubmit: (values: PostTripFormValues) => void;
}

export default function PostTripForm({ onSubmit }: Props) {
  const [values, setValues] = useState<PostTripFormValues>({
    origin: "",
    destination: "",
    date: "",
    seats: 1,
    price: 0,
    approvalMode: "AUTO",
  });

  const updateField = (field: keyof PostTripFormValues, value: any) => {
    setValues((v) => ({ ...v, [field]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="card space-y-6"
    >
      {/* ORIGIN */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">Origin</label>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            className="pl-10"
            value={values.origin}
            onChange={(e) => updateField("origin", e.target.value)}
          />
        </div>
      </div>

      {/* DESTINATION */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">Destination</label>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            className="pl-10"
            value={values.destination}
            onChange={(e) => updateField("destination", e.target.value)}
          />
        </div>
      </div>

      {/* DATE */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">Departure Date</label>
        <div className="relative">
          <FiCalendar className="absolute left-3 top-3 text-gray-400" />
          <input
            type="datetime-local"
            className="pl-10"
            value={values.date}
            onChange={(e) => updateField("date", e.target.value)}
          />
        </div>
      </div>

      {/* SEATS */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">Available Seats</label>
        <input
          type="number"
          min={1}
          value={values.seats}
          onChange={(e) => updateField("seats", Number(e.target.value))}
        />
      </div>

      {/* PRICE */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">Price (KES)</label>
        <input
          type="number"
          min={100}
          value={values.price}
          onChange={(e) => updateField("price", Number(e.target.value))}
        />
      </div>

      {/* APPROVAL MODE */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">Approval Mode</label>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => updateField("approvalMode", "AUTO")}
            className={`px-4 py-2 rounded-xl border ${
              values.approvalMode === "AUTO"
                ? "bg-primary text-white border-primary"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            AUTO
          </button>

          <button
            type="button"
            onClick={() => updateField("approvalMode", "MANUAL")}
            className={`px-4 py-2 rounded-xl border ${
              values.approvalMode === "MANUAL"
                ? "bg-secondary text-white border-secondary"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            MANUAL
          </button>
        </div>

        {values.approvalMode === "AUTO" && (
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FiCheckCircle className="text-primary" /> Passengers auto-approved.
          </p>
        )}

        {values.approvalMode === "MANUAL" && (
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FiCheckCircle className="text-secondary" /> You will manually approve bookings.
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
  );
}
