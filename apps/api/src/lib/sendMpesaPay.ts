// src/lib/sendMpesaPay.ts
import axios from "axios";
import { env } from "../env";

/**
 * Placeholder: Implement real Mpesa STK Push or B2C using credentials.
 * For now returns a fake providerTxId for dev.
 */
export async function sendMpesaSTK({ phone, amount, accountRef }: { phone: string; amount: number; accountRef?: string }) {
  // In production call Safaricom API
  return {
    provider: "MPESA",
    providerTxId: `MPESA-STK-${Date.now()}`,
    status: "PENDING",
    raw: {}
  };
}

export async function sendMpesaPayout({ phone, amount }: { phone: string; amount: number }) {
  // Placeholder for B2C payouts
  return {
    provider: "MPESA",
    providerTxId: `MPESA-PAY-${Date.now()}`,
    status: "SENT"
  };
}
