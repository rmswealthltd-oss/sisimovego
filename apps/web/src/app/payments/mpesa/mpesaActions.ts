"use client";

import { Api } from "@/lib/api";

export async function startMpesaStkPush(data: {
  phone: string;
  amountCents: number;
  bookingId: string;
}) {
  const res = await Api.post("/payments/mpesa/stkPush", data);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Mpesa STK Push failed");
  }

  return res.json();
}

export async function pollMpesaStatus(requestId: string) {
  const res = await Api.get(`/payments/mpesa/status?requestId=${requestId}`);

  if (!res.ok) {
    throw new Error("Failed checking Mpesa status");
  }

  return res.json();
}
