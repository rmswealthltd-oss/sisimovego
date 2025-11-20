"use client";
import React, { useState } from "react";
import { Api } from "@/lib/api";
import { useRouter } from "next/navigation";
import PaymentOption from "@/components/PaymentOption";

export default function CheckoutClient({ booking }: { booking: any }) {
  const [method, setMethod] = useState<"mpesa"|"stripe">("mpesa");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function start() {
    setLoading(true);
    try {
      const res = await Api.createCheckout({ bookingId: booking.id, method });
      if (method === "mpesa") router.push(`/payments/mpesa?checkoutId=${res.checkoutId}`);
      else if (method === "stripe") {
        if (res.redirectUrl) window.location.href = res.redirectUrl;
        else router.push(`/payments/stripe?checkoutId=${res.checkoutId}`);
      }
    } catch (e:any) {
      alert(e?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <div className="text-sm text-gray-500">Booking: {booking.id}</div>
      <div className="text-lg font-semibold">KES {(booking.totalCents/100).toFixed(2)}</div>

      <div className="space-y-2">
        <PaymentOption
          value="mpesa"
          label="MPESA"
          description="STK Push"
          selected={method}
          onSelect={setMethod}
        />

        <PaymentOption
          value="stripe"
          label="Stripe"
          description="Card / Apple Pay"
          selected={method}
          onSelect={setMethod}
        />
      </div>

      <button
        disabled={loading}
        onClick={start}
        className="px-4 py-2 bg-primary text-white rounded"
      >
        {loading ? "Processing..." : "Pay now"}
      </button>
    </div>
  );
}
