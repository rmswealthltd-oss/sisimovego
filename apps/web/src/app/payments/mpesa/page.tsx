// apps/web/src/app/payments/mpesa/page.tsx
import dynamic from "next/dynamic";
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "MPESA payment" });

const MpesaClient = dynamic(() => import("./_MpesaClient"), { ssr: false });

export default async function MpesaPage({ searchParams }: any) {
  const checkoutId = searchParams?.checkoutId ?? null;
  if (!checkoutId) return <div className="p-6">Missing checkout id</div>;
  // Optionally fetch some initial state server-side to show on page
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">MPESA</h1>
      <MpesaClient checkoutId={checkoutId} />
    </div>
  );
}
