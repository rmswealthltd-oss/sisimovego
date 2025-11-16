"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookingTimeline from "../../../components/BookingTimeline";
import Map from "../../../components/Map";
import DriverCard from "../../../components/DriverCard";
import { Api } from "../../../lib/api";

export default function BookingDetailsInner() {
  const { id } = useParams();
  const [booking, setBooking] = useState<any | null>(null);

  useEffect(() => {
    Api.get(`/bookings/${id}`).then((res) => setBooking(res.booking));
  }, [id]);

  if (!booking) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Booking Details</h1>

      <div className="bg-white p-4 shadow rounded space-y-4">
        <BookingTimeline status={booking.status} />

        <div className="text-sm text-gray-500">
          {booking.origin} → {booking.destination}
        </div>

        <DriverCard driver={booking.driver} />

        <Map
          height="300px"
          markers={[
            { lat: booking.originLat, lng: booking.originLng },
            { lat: booking.destLat, lng: booking.destLng },
          ]}
        />
      </div>
    </div>
  );
}
