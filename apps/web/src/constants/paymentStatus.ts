// apps/web/src/constants/paymentStatus.ts

export const PaymentStatus = {
  INITIATED: "INITIATED",
  PROCESSING: "PROCESSING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;

export type PaymentStatusType =
  (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentStatusLabels: Record<PaymentStatusType, string> = {
  INITIATED: "Initiated",
  PROCESSING: "Processing",
  SUCCESS: "Success",
  FAILED: "Failed",
};
