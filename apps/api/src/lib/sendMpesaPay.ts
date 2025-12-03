// src/lib/sendMpesaPay.ts

/**
 * Placeholder: Implement real Mpesa STK Push or B2C using credentials.
 * For now returns a fake providerTxId for dev.
 */

export async function sendMpesaSTK({
  phone: _phone,
  amount: _amount,
  accountRef: _accountRef
}: { phone: string; amount: number; accountRef?: string }) {
  return {
    provider: "MPESA",
    providerTxId: `MPESA-STK-${Date.now()}`,
    status: "PENDING",
    raw: {}
  };
}

export async function sendMpesaPayout({
  phone: _phone,
  amount: _amount
}: { phone: string; amount: number }) {
  return {
    provider: "MPESA",
    providerTxId: `MPESA-PAY-${Date.now()}`,
    status: "SENT"
  };
}
