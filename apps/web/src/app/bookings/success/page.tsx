// apps/web/src/app/booking/success/page.tsx
import { Api } from "../../../lib/api";

interface Props { searchParams: { bookingId?: string } }

export default async function Success({ searchParams }: Props) {
  const bookingId = String(searchParams.bookingId ?? "");
  let booking: any = null;
  if (bookingId) {
    try {
      const res = await Api.get(`/bookings/${encodeURIComponent(bookingId)}`);
      booking = res.booking ?? res;
    } catch {}
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-semibold">Booking confirmed</h1>
        <p className="mt-3 text-gray-600">Your booking {bookingId ? `#${bookingId}` : ""} is confirmed.</p>

        {booking && (
          <div className="mt-4 text-left">
            <div><strong>Trip:</strong> {booking.origin} → {booking.destination}</div>
            <div><strong>Departure:</strong> {new Date(booking.departureAt).toLocaleString()}</div>
            <div><strong>Seats:</strong> {booking.seats}</div>
          </div>
        )}

        <div className="mt-6">
          <a className="px-4 py-2 bg-primary text-white rounded" href="/bookings">View my bookings</a>
        </div>
      </div>
    </div>
  );
}
