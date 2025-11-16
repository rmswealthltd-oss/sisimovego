// apps/web/src/app/page.tsx

import dynamic from "next/dynamic";
import Image from "next/image";

import { apiGet } from "@/lib/serverApi";
import { ENDPOINTS } from "@/constants/endpoints";
import { buildMeta } from "@/lib/seo";

// Client-only components
const HeroSearch = dynamic(() => import("@/components/HeroSearch"), { ssr: false });
const TripCard = dynamic(() => import("@/components/TripCard"), { ssr: false });

export const metadata = buildMeta({
  title: "SisiMove — Africa's best ridesharing",
  description: "Book intercity and intra-city trips across Africa — fast, safe, affordable."
});

export default async function HomePage() {
  // Attempt API fetch for "featured trips"
  let featured: any[] = [];

  try {
    const res = await apiGet(ENDPOINTS.TRIPS_SEARCH + "?featured=true");
    featured = res?.trips ?? [];
  } catch {
    // --- fallback static routes ---
    featured = [
      { id: "f1", origin: "Nairobi", destination: "Mombasa", fareCents: 3500, seatsAvailable: 6, operatorName: "SisiMove Express" },
      { id: "f2", origin: "Nairobi", destination: "Nakuru", fareCents: 1500, seatsAvailable: 4, operatorName: "SisiMove Local" },
      { id: "f3", origin: "Kisumu", destination: "Eldoret", fareCents: 2200, seatsAvailable: 5, operatorName: "LakeLine" },
    ];
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">

      {/* HERO BANNER */}
      <section className="relative h-56 rounded-xl overflow-hidden shadow-lg">
        <Image
          src="/hero.jpg"
          alt="SisiMove Africa Ride"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-end p-6">
          <h1 className="text-3xl font-bold text-white">
            Move smarter across Africa.
          </h1>
        </div>
      </section>

      {/* SEARCH */}
      <section>
        <HeroSearch />
      </section>

      {/* FEATURED TRIPS */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Featured Trips</h2>

        {featured.length === 0 ? (
          <p className="text-gray-500">No featured trips right now.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>

      {/* WHY SISIMOVE */}
      <section className="mt-6 p-4 bg-white rounded shadow">
        <h3 className="font-semibold">Why SisiMove?</h3>
        <ul className="mt-2 text-gray-600 list-disc list-inside space-y-1">
          <li>Driver vetting & ratings</li>
          <li>Multiple payment methods (M-Pesa, Card)</li>
          <li>Real-time trip tracking</li>
        </ul>
      </section>

    </main>
  );
}
