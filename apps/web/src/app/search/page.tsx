// apps/web/src/app/search/page.tsx

import HeroSearch from "@/components/HeroSearch";
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({
  title: "Search trips | SisiMove",
  description: "Find fast, safe and affordable intercity rides.",
});

export default function SearchPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* HEADER */}
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Find trips across cities</h1>
        <p className="text-gray-600 text-lg">
          Search available rides and book seats instantly.
        </p>
      </header>

      {/* SEARCH FORM */}
      <div className="max-w-3xl mx-auto">
        <HeroSearch />
      </div>

      {/* POPULAR ROUTES */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Popular routes</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ["Nairobi", "Mombasa"],
            ["Nairobi", "Nakuru"],
            ["Kisumu", "Eldoret"],
          ].map(([from, to]) => (
            <div
              key={from + to}
              className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <p className="font-semibold text-lg">
                {from} → {to}
              </p>
              <p className="text-gray-600 text-sm mt-1">Daily trips available</p>
            </div>
          ))}
        </div>
      </section>

      {/* INFO / SEO CONTENT */}
      <section className="pt-8 text-gray-600 text-sm leading-relaxed max-w-3xl">
        <p>
          SisiMove connects passengers with verified drivers for intercity and
          regional travel. We make it easy to book safe, affordable and reliable
          rides across Kenya. Search for available seats, compare prices, and
          book your next trip in seconds.
        </p>
      </section>
    </div>
  );
}
