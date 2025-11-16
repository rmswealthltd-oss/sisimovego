// apps/web/src/app/support/page.tsx
import Link from "next/link";
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "Support • SisiMove" });

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Support</h1>
      <p className="text-gray-600 mt-2">Need help? Choose one of the options below.</p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium">Contact</h3>
          <p className="text-sm text-gray-500 mt-2">Email us at <a className="text-primary" href="mailto:support@sisimove.com">support@sisimove.com</a></p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium">FAQ</h3>
          <p className="text-sm text-gray-500 mt-2">See <Link href="/support/faq" className="text-primary">Frequently asked questions</Link></p>
        </div>
      </div>
    </div>
  );
}
