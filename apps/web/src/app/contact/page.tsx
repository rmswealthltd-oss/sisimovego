// apps/web/src/app/contact/page.tsx
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "Contact • SisiMove" });

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <p className="text-gray-600 mt-2">For support or partnerships, email <a className="text-primary" href="mailto:partnerships@sisimove.com">partnerships@sisimove.com</a>.</p>
    </div>
  );
}
