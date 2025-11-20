// apps/web/src/app/bookings/[id]/page.tsx
import { apiGet } from "@/lib/serverApi";
import { ENDPOINTS } from "@/lib/config";
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "Booking details" });

interface Booking {
  id: string;
  origin?: string;
  destination?: string;
  departureAt?: string | number | Date;
  status?: string;
  [key: string]: any;
}

export default async function BookingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params?.id ?? "";
  if (!id) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600">Invalid booking ID</p>
      </div>
    );
  }

  let booking: Booking | null = null;

  try {
    const res = await apiGet(
      `${ENDPOINTS.BOOKINGS_MY}/${encodeURIComponent(id)}`
    );

    booking = (res?.booking ?? res ?? null) as Booking | null;
  } catch {
    booking = null;
  }

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600">Booking not found</p>
      </div>
    );
  }

  // Safe date parsing
  const departureDate =
    booking.departureAt && !isNaN(new Date(booking.departureAt).getTime())
      ? new Date(booking.departureAt).toLocaleString()
      : "Unknown";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">
        Booking {booking.id ?? "Unknown"}
      </h1>

      <div className="bg-white p-4 rounded shadow mt-4">
        <div className="font-medium">
          {(booking.origin ?? "Unknown") +
            " → " +
            (booking.destination ?? "Unknown")}
        </div>

        <div className="text-sm text-gray-500">
          Departure: {departureDate}
        </div>

        <div className="text-sm text-gray-600 mt-2">
          Status: {booking.status ?? "Unknown"}
        </div>
      </div>
    </div>
  );
}
