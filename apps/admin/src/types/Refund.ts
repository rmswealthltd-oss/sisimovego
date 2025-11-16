export type RefundStatus = "OPEN" | "APPROVED" | "DENIED" | "PAID" | "CANCELLED";

export interface Refund {
  id: string;
  tripId?: string | null;
  bookingId?: string | null;
  passenger?: { id: string; name?: string; email?: string; phone?: string };
  amountCents: number;
  reason: string;
  status: RefundStatus;
  createdAt: string;
  updatedAt?: string;
  timeline?: Array<{ type: string; at: string; note?: string }>;
}
