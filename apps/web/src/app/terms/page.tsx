// apps/web/src/app/terms/page.tsx
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "Terms • SisiMove" });

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Terms & Conditions</h1>
      <p className="text-gray-600 mt-3">By using SisiMove you agree to our terms. Updated 2025.</p>
    </div>
  );
}
