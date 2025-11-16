// apps/web/src/app/trip/[tripId]/page.tsx
import { ENDPOINTS } from "@/lib/config";
import DriverCard from "@/components/DriverCard"; // client
import TripInner from "./_TripInner"; // client booking inner; kept as client
import dynamic from "next/dynamic";
import { buildMeta } from "@/lib/seo";

const RealtimeClient = dynamic(() => import("./realtime/ClientWrapper"), { ssr: false });
// Note: RealtimeClient is a client component that mounts the realtime tracking UI (we previously created a realtime page)

export const metadata = buildMeta({ title: "Trip details" });

type Props = { params: { tripId: string } };

async function getTrip(tripId: string) {
  const url = ENDPOINTS.TRIP_GET(tripId);
  const res = await fetch(url, { next: { revalidate: 30 } }); // cache for 30s
  if (!res.ok) throw new Error("Failed to fetch trip");
  const body = await res.json();
  return body.trip ?? body;
}

export default async function TripPage({ params }: Props) {
  const tripId = params.tripId;
  let trip: any = null;
  try {
    trip = await getTrip(tripId);
  } catch (err) {
    console.error("Trip fetch error", err);
    // Let Next handle not found or error via not-found or error boundary
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Trip not found</h2>
        <p className="text-gray-600 mt-2">We couldn't load that trip.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <h1 className="text-xl font-semibold">
            {trip.origin.address} → {trip.destination.address}
          </h1>
          <div className="text-sm text-gray-500 mt-1">Departure: {new Date(trip.departureAt).toLocaleString()}</div>

          {/* TripInner is the interactive booking form (client) */}
          <div className="mt-4">
            {/* TripInner expects to be a client component */}
            <TripInner serverTrip={trip} />
          </div>
        </div>

        <aside className="bg-white p-4 rounded shadow space-y-4">
          <div>
            <div className="text-sm text-gray-500">Driver</div>
            <DriverCard driver={trip.driver} />
          </div>

          <div>
            <h3 className="text-sm text-gray-500">Live tracking</h3>
            {/* Realtime client island (client-only) */}
            <div className="mt-2 h-44">
              <RealtimeClient tripId={tripId} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
