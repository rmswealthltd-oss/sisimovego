// apps/web/src/app/promos/page.tsx
import { buildMeta } from "@/lib/seo";
import PromoInputClient from "./PromoInputClient"; // client wrapper

export const metadata = buildMeta({ title: "Promos • SisiMove" });

export default function PromosPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold">Promo codes</h1>
      <p className="text-gray-600 mt-2">
        Apply promo codes to get discounts on trips.
      </p>

      <div className="mt-4">
        <PromoInputClient />
      </div>
    </div>
  );
}
