export interface LedgerEntry {
  id: string;
  walletId?: string | null;
  bookingId?: string | null;
  amount: number; // cents
  type: string;
  description?: string | null;
  createdAt: string;
}
