// apps/web/src/app/promos/page.tsx
import dynamic from "next/dynamic";
import { buildMeta } from "@/lib/seo";

const PromoInput = dynamic(() => import("@/components/PromoInput"), { ssr: false });

export const metadata = buildMeta({ title: "Promos • SisiMove" });

export default function PromosPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold">Promo codes</h1>
      <p className="text-gray-600 mt-2">Apply promo codes to get discounts on trips.</p>
      <div className="mt-4">
        <PromoInput onApply={(code: string) => { console.log("Apply promo:", code); }} />
      </div>
    </div>
  );
}
