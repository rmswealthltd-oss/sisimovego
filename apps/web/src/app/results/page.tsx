// apps/web/src/app/results/page.tsx
import TripCard from "@/components/TripCard"; 
import { buildMeta } from "@/lib/seo";
import { ENDPOINTS } from "@/lib/config";

export const metadata = buildMeta({
  title: "Search results",
  description: "Available trips",
});

type Props = {
  searchParams?: {
    origin?: string;
    destination?: string;
    date?: string;
  };
};

// Normalizes whatever backend returns → TripCard-safe shape
function normalizeTrip(raw: any) {
  return {
    id: raw.id,
    origin: raw.origin,
    destination: raw.destination,

    departureAt: raw.departureAt ?? raw.departure_time ?? null,
    arrivalAt: raw.arrivalAt ?? raw.arrival_time ?? null,

    driverName:
      raw.driverName ??
      raw.driver ??
      raw.driver_full_name ??
      raw.operatorName ??
      "Unknown",

    priceCents:
      raw.priceCents ??
      raw.fareCents ??
      raw.pricePerSeat ??
      raw.fare ??
      0,
  };
}

async function fetchTrips(origin?: string, destination?: string, date?: string) {
  const params = new URLSearchParams();
  if (origin) params.set("origin", origin);
  if (destination) params.set("destination", destination);
  if (date) params.set("date", date);

  const url = `${ENDPOINTS.TRIPS_SEARCH}?${params.toString()}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return [];

  const body = await res.json();
  const raw = body.trips ?? body;

  return Array.isArray(raw) ? raw.map(normalizeTrip) : [];
}

export default async function ResultsPage({ searchParams }: Props) {
  const origin = searchParams?.origin ?? "";
  const destination = searchParams?.destination ?? "";
  const date = searchParams?.date ?? "";

  let trips: any[] = [];

  try {
    trips = await fetchTrips(origin, destination, date);
  } catch (e) {
    console.error("Failed fetching trips", e);
    trips = [];
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Search results</h1>
        <p className="text-gray-600 mt-1">
          {trips.length ? `${trips.length} result(s)` : "No trips found"}
        </p>
      </header>

      <main>
        {trips.length === 0 ? (
          <div className="text-gray-600">No trips. Try adjusting your search.</div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
