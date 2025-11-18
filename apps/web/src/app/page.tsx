import dynamic from "next/dynamic";
import { apiGet } from "@/lib/serverApi";
import { ENDPOINTS } from "@/constants/endpoints";
import { buildMeta } from "@/lib/seo";

// Client-side components
const HeroSearch = dynamic(() => import("@/components/HeroSearch"), { ssr: false });
const TripCard = dynamic(() => import("@/components/TripCard"), { ssr: false });

export const metadata = buildMeta({
  title: "SisiMove — Africa's best ridesharing",
  description: "Book intercity and intra-city trips across Africa — fast, safe, affordable."
});

export default async function HomePage() {
  let featured: any[] = [];

  try {
    const res = await apiGet(ENDPOINTS.TRIPS_SEARCH + "?featured=true");
    featured = res?.trips ?? [];
  } catch {
    featured = [
      { id: "f1", origin: "Nairobi", destination: "Mombasa", fareCents: 3500, seatsAvailable: 6, operatorName: "SisiMove Express" },
      { id: "f2", origin: "Nairobi", destination: "Nakuru", fareCents: 1500, seatsAvailable: 4, operatorName: "SisiMove Local" },
      { id: "f3", origin: "Kisumu", destination: "Eldoret", fareCents: 2200, seatsAvailable: 5, operatorName: "LakeLine" },
    ];
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-sky-700 opacity-95"></div>
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-white">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl leading-tight font-bold">
              Move smarter across Africa.
            </h1>

            <p className="text-lg md:text-xl text-blue-100">
              Fast, safe and affordable intercity rides. Book in seconds, travel stress-free.
            </p>

            <div className="pt-6">
              <HeroSearch />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              ["10,000+", "Monthly riders"],
              ["4.9/5", "Safety rating"],
              ["500+", "Verified drivers"],
              ["50+", "Cities served"],
            ].map(([big, small]) => (
              <div key={big}>
                <p className="text-2xl font-semibold">{big}</p>
                <p className="text-xs text-blue-200">{small}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TRIPS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold mb-8">Featured Trips</h2>

        {featured.length === 0 ? (
          <p className="text-gray-600">No featured trips right now.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((trip) => (
              <div className="hover:scale-[1.02] transition" key={trip.id}>
                <TripCard trip={trip} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* POPULAR CITIES */}
      <section className="bg-white py-20 border-y">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-8">Popular Cities</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Nairobi", "Mombasa", "Kisumu", "Nakuru"].map((city) => (
              <div
                key={city}
                className="p-6 rounded-xl border bg-gray-50 hover:bg-gray-100 shadow-sm transition cursor-pointer text-center font-medium"
              >
                {city}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY SISIMOVE */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-12 text-center">
            Why ride with SisiMove?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              ["Reliable Drivers", "All drivers are trained and verified for safe trips."],
              ["Affordable Rides", "Transparent pricing with no hidden fees."],
              ["Fast Booking", "Book in seconds and get live trip tracking."],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="p-8 rounded-xl bg-white border shadow-sm hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-sky-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-semibold">Ready to move?</h2>
          <p className="text-blue-100">
            Join thousands of passengers using SisiMove every day.
          </p>

          <a
            href="/signup"
            className="inline-block bg-white text-primary font-medium px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition text-lg"
          >
            Create your account
          </a>
        </div>
      </section>
    </main>
  );
}
