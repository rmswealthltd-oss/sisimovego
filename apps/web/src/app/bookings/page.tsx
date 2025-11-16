// apps/web/src/app/bookings/page.tsx
import { apiGet } from "@/lib/serverApi";
import { ENDPOINTS } from "@/lib/config";
import Link from "next/link";
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "My bookings" });

export default async function BookingsPage() {
  const res = await apiGet(ENDPOINTS.BOOKINGS_MY);
  const bookings = res?.bookings ?? [];

  if (!bookings || bookings.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">My bookings</h1>
        <div className="mt-4 text-gray-500">You have no bookings.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My bookings</h1>
      <div className="space-y-3">
        {bookings.map((b:any) => (
          <Link key={b.id} href={`/bookings/${b.id}`} className="block bg-white p-4 rounded shadow">
            <div className="font-medium">{b.origin} → {b.destination}</div>
            <div className="text-sm text-gray-500">Departure: {new Date(b.departureAt).toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-2">Status: {b.status}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
