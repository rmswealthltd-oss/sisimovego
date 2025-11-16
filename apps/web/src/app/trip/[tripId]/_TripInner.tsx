// apps/web/src/app/trip/[tripId]/_TripInner.tsx
"use client";

import React, { useState } from "react";
import { Api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function TripInner({ serverTrip }: { serverTrip: any }) {
  const trip = serverTrip;
  const router = useRouter();
  const [seats, setSeats] = useState(1);
  const [creating, setCreating] = useState(false);

  async function handleBook(e?: React.FormEvent) {
    e?.preventDefault();
    if (!trip) return;
    setCreating(true);
    try {
      const res = await Api.createBooking({ tripId: trip.id, seats });
      const bookingId = res.bookingId ?? res.booking?.id;
      router.push(`/payments/checkout?bookingId=${encodeURIComponent(bookingId)}`);
    } catch (err:any) {
      alert(err?.message || "Booking failed");
    } finally {
      setCreating(false);
    }
  }

  return (
    <form onSubmit={handleBook} className="space-y-4">
      <div>
        <label className="text-sm text-gray-600">Seats</label>
        <div className="flex items-center gap-3 mt-1">
          <button type="button" onClick={() => setSeats(Math.max(1, seats - 1))} className="px-3 py-1 border rounded">-</button>
          <div className="w-10 text-center">{seats}</div>
          <button type="button" onClick={() => setSeats(Math.min(trip.seatsAvailable ?? 1, seats + 1))} className="px-3 py-1 border rounded">+</button>
        </div>
      </div>

      <div>
        <div className="text-lg font-semibold">KES {(trip.fareCents / 100).toFixed(2)}</div>
      </div>

      <div>
        <button disabled={creating} type="submit" className="px-4 py-2 bg-primary text-white rounded">
          {creating ? "Booking..." : `Book ${seats} seat${seats > 1 ? "s" : ""}`}
        </button>
      </div>
    </form>
  );
}
