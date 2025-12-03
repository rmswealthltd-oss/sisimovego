// apps/web/types/payment.ts

export enum PaymentMethod {
  MPESA = "MPESA",
  STRIPE = "STRIPE",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export type Payment = {
  id: string;
  amountCents: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;

  bookingId?: string | null;
  tripRequestId?: string | null;
  userId?: string | null;

  // MPESA extras
  providerTxId?: string | null;

  // Derived fields for UI (not in DB)
  checkoutId?: string;
  redirectUrl?: string | null;
};

export type CreateCheckoutInput = {
  bookingId: string;
  method: "mpesa" | "stripe";
};

export type CreateCheckoutResponse = {
  checkoutId: string;

  // only used for Stripe
  redirectUrl?: string | null;
};
