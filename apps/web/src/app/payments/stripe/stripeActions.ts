"use client";

import { Api } from "@/lib/api";

export async function confirmStripePayment(checkoutId: string) {
  const res = await Api.get(`/payments/stripe/confirm?checkoutId=${checkoutId}`);

  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.message || "Stripe confirmation failed");
  }

  return res.json();
}
