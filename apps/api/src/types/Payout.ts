// src/types/Payout.ts
export interface Payout {
  id: string;
  driverId?: string;
  amount: number;
  providerTxId?: string | null;
  status: string;
}
