// apps/web/src/app/results/page.tsx
import TripCard from "@/components/TripCard"; // client
import ListSkeleton from "@/components/ListSkeleton"; // client
import { buildMeta } from "@/lib/seo";
import { ENDPOINTS } from "@/lib/config";

export const metadata = buildMeta({ title: "Search results", description: "Available trips" });

type Props = { searchParams?: { origin?: string; destination?: string; date?: string } };

async function fetchTrips(origin?: string, destination?: string, date?: string) {
  // Build URL to the API search endpoint
  const params = new URLSearchParams();
  if (origin) params.set("origin", origin);
  if (destination) params.set("destination", destination);
  if (date) params.set("date", date);

  const url = `${ENDPOINTS.TRIPS_SEARCH}?${params.toString()}`;
  // server fetch (can be cached). Revalidate every 60s for near-realtime freshness.
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    // return empty array on error — UI can show friendly message
    return [];
  }
  const body = await res.json();
  return body.trips ?? body;
}

export default async function ResultsPage({ searchParams }: Props) {
  // `searchParams` is available in Next.js server components
  const origin = searchParams?.origin ?? "";
  const destination = searchParams?.destination ?? "";
  const date = searchParams?.date ?? "";

  let trips = [];
  try {
    trips = await fetchTrips(origin, destination, date);
  } catch (e) {
    console.error("Failed fetching trips server-side", e);
    trips = [];
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Search results</h1>
        <p className="text-gray-600 mt-1">{trips.length ? `${trips.length} result(s)` : "No trips found"}</p>
      </header>

      <main>
        {trips.length === 0 ? (
          <div className="text-gray-600">No trips. Try adjusting your search.</div>
        ) : (
          <div className="space-y-4">
            {trips.map((t: any) => (
              // TripCard is a client component (interactive) — OK to use inside server component
              <TripCard key={t.id} trip={t} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
