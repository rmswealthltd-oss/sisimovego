export type PayoutStatus = "PENDING" | "SENT" | "FAILED" | "PAID";

export interface Payout {
  id: string;
  driverId?: string;
  amount: number; // cents
  providerTxId?: string | null;
  status: PayoutStatus;
  batchId?: string | null;
  createdAt: string;
  updatedAt?: string;
}
