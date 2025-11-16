// apps/web/src/app/search/page.tsx
import HeroSearch from "@/components/HeroSearch"; // client component
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({
  title: "Search trips",
  description: "Find and book trips across cities",
});

export default function SearchPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* PAGE HEADER */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Find trips across cities</h1>
        <p className="text-gray-600 mt-1">
          Search available rides and seats between cities.
        </p>
      </header>

      {/* SEARCH FORM (client component) */}
      <HeroSearch />

      {/* OPTIONAL STATIC CONTENT FOR SEO */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Popular routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div className="bg-white p-4 rounded shadow">Nairobi → Mombasa</div>
          <div className="bg-white p-4 rounded shadow">Nairobi → Nakuru</div>
          <div className="bg-white p-4 rounded shadow">Kisumu → Eldoret</div>
        </div>
      </section>
    </div>
  );
}
