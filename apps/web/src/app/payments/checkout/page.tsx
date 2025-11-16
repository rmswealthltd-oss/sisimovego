// apps/web/src/app/payments/checkout/page.tsx
import { apiGet } from "@/lib/serverApi";
import { ENDPOINTS } from "@/lib/config";
import dynamic from "next/dynamic";
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "Checkout" });

const CheckoutClient = dynamic(() => import("./_CheckoutClient"), { ssr: false });

export default async function CheckoutPage({ searchParams }: any) {
  const bookingId = searchParams?.bookingId;
  if (!bookingId) {
    return <div className="p-6">Missing booking id</div>;
  }

  const res = await apiGet(`${ENDPOINTS.BOOKINGS_CREATE.replace("/create","")}/${encodeURIComponent(bookingId)}`); // adjust path
  const booking = res?.booking ?? res ?? null;

  if (!booking) {
    return <div className="p-6">Booking not found</div>;
  }

  // pass booking object to client checkout component
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <CheckoutClient booking={booking} />
    </div>
  );
}
