// src/types/Payout.ts

export type PayoutStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED";

export interface Payout {
  id: string;

  // Nullable if created before driver is assigned
  driverId?: string | null;

  // Stored as INT cents in DB
  amount: number;

  providerTxId?: string | null;

  status: PayoutStatus;
}
