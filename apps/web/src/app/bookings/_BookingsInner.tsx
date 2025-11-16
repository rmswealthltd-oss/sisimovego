"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Api } from "../../lib/api";
import BookingTimeline from "../../components/BookingTimeline";

export default function BookingsInner() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    Api.get("/bookings/mine").then((res) => setBookings(res.bookings || []));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">My Bookings</h1>

      <div className="space-y-3">
        {bookings.map((b) => (
          <Link
            key={b.id}
            href={`/bookings/${b.id}`}
            className="bg-white block rounded shadow p-4 hover:bg-gray-50"
          >
            <div className="font-medium">{b.trip.route}</div>
            <BookingTimeline status={b.status} />
            <div className="text-sm text-gray-500">
              {b.origin} → {b.destination}
            </div>
          </Link>
        ))}

        {!bookings.length && (
          <div className="text-gray-500 text-sm">
            You have no bookings yet.
          </div>
        )}
      </div>
    </div>
  );
}
