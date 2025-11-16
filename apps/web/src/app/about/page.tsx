// apps/web/src/app/about/page.tsx
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "About • SisiMove" });

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">About SisiMove</h1>
      <p className="text-gray-600 mt-3">
        SisiMove is Africa-first ridesharing — connecting passengers and drivers with reliable trips across cities.
      </p>
    </div>
  );
}
