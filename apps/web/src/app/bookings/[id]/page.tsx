// apps/web/src/app/bookings/[id]/page.tsx
import { apiGet } from "@/lib/serverApi";
import { ENDPOINTS } from "@/lib/config";
import { buildMeta } from "@/lib/seo";
import dynamic from "next/dynamic";

export const metadata = buildMeta({ title: "Booking details" });

export default async function BookingDetailsPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const res = await apiGet(`${ENDPOINTS.BOOKINGS_MY}/${encodeURIComponent(id)}`); // adjust endpoint as needed
  const booking = res?.booking ?? res ?? null;

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Booking {booking.id}</h1>
      <div className="bg-white p-4 rounded shadow mt-4">
        <div className="font-medium">{booking.origin} → {booking.destination}</div>
        <div className="text-sm text-gray-500">Departure: {new Date(booking.departureAt).toLocaleString()}</div>
        <div className="text-sm text-gray-600 mt-2">Status: {booking.status}</div>
      </div>
    </div>
  );
}
