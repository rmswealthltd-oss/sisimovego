export const REFUND_STATUS = {
  OPEN: "OPEN",
  APPROVED: "APPROVED",
  DENIED: "DENIED",
  PAID: "PAID",
  CANCELLED: "CANCELLED"
} as const;

export type RefundStatus = typeof REFUND_STATUS[keyof typeof REFUND_STATUS];
