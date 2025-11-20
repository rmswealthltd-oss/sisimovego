// apps/web/src/app/payments/stripe/page.tsx
import dynamic from "next/dynamic";
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "Stripe return" });

const StripeClient = dynamic(() => import("./StripeClient"), { ssr: false });

export default async function StripeReturnPage({ searchParams }: any) {
  const checkoutId = searchParams?.checkoutId ?? null;

  if (!checkoutId)
    return <div className="p-6">Missing checkout id</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Stripe Payment</h1>
      <StripeClient checkoutId={checkoutId} />
    </div>
  );
}
