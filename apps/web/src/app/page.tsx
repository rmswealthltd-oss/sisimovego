// apps/web/src/app/page.tsx

import dynamic from "next/dynamic";
import HeroBanner from "@/components/HeroBanner";
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
    // --- Fallback static featured routes ---
    featured = [
      { id: "f1", origin: "Nairobi", destination: "Mombasa", fareCents: 3500, seatsAvailable: 6, operatorName: "SisiMove Express" },
      { id: "f2", origin: "Nairobi", destination: "Nakuru", fareCents: 1500, seatsAvailable: 4, operatorName: "SisiMove Local" },
      { id: "f3", origin: "Kisumu", destination: "Eldoret", fareCents: 2200, seatsAvailable: 5, operatorName: "LakeLine" },
    ];
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <section className="px-4 md:px-8 pt-10 pb-20">
        <div className="max-w-5xl mx-auto space-y-10">
          <HeroBanner />
          <HeroSearch />
        </div>
      </section>

      {/* FEATURED TRIPS */}
      <section className="max-w-5xl mx-auto px-4 md:px-0 pb-16">
        <h2 className="text-2xl font-semibold mb-6">Featured Trips</h2>

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

      {/* POPULAR CITIES */}
      <section className="bg-white py-16 border-y">
        <div className="max-w-5xl mx-auto px-4 md:px-0">
          <h2 className="text-2xl font-semibold mb-6">Popular cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {["Nairobi", "Mombasa", "Kisumu", "Nakuru"].map((city) => (
              <div
                key={city}
                className="p-4 rounded-xl border bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
              >
                {city}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY SISIMOVE */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-0">
          <h2 className="text-2xl font-semibold mb-10">Why ride with Sisimove?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <h3 className="text-lg font-medium mb-2">Reliable Drivers</h3>
              <p className="text-sm text-gray-600">
                All drivers are trained and verified to ensure safe trips.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <h3 className="text-lg font-medium mb-2">Affordable Rides</h3>
              <p className="text-sm text-gray-600">
                Transparent pricing with no hidden charges.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <h3 className="text-lg font-medium mb-2">Fast Booking</h3>
              <p className="text-sm text-gray-600">
                Book a ride in seconds and get real-time trip updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-sky-600 text-white py-16 mt-10">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Ready to move?</h2>
          <p className="text-sm text-blue-50">
            Join thousands of passengers using Sisimove every day.
          </p>

          <a
            href="/signup"
            className="inline-block bg-white text-primary font-medium px-6 py-3 rounded-lg shadow"
          >
            Create your account
          </a>
        </div>
      </section>
    </main>
  );
}
