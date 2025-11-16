// apps/web/src/app/privacy/page.tsx
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "Privacy • SisiMove" });

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="text-gray-600 mt-3">We respect your privacy. This page explains how we collect and use data.</p>
    </div>
  );
}
