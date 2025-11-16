// apps/web/src/app/support/faq/page.tsx
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "FAQ • SisiMove" });

const FAQ = [
  { q: "How do I book?", a: "Search, pick seats, then pay to confirm your booking." },
  { q: "What payment methods are supported?", a: "M-Pesa and card payments via Stripe." },
  { q: "How do I request a refund?", a: "Open your booking and request refund — support will review." }
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Frequently Asked Questions</h1>
      <div className="mt-4 space-y-4">
        {FAQ.map((f, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            <div className="font-medium">{f.q}</div>
            <div className="text-sm text-gray-600 mt-1">{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
