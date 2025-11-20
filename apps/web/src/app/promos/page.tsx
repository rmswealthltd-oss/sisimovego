"use client";

import { buildMeta } from "@/lib/seo";
import PromoInput from "@/components/PromoInput";

export const metadata = buildMeta({ title: "Promos • SisiMove" });

export default function PromosPage() {
  function handleApply(code: string) {
    console.log("Apply promo:", code);
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold">Promo codes</h1>
      <p className="text-gray-600 mt-2">
        Apply promo codes to get discounts on trips.
      </p>

      <div className="mt-4">
        <PromoInput onApply={handleApply} />
      </div>
    </div>
  );
}
