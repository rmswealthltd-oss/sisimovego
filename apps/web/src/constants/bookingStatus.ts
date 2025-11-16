// apps/web/src/constants/bookingStatus.ts

export const BookingStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export type BookingStatusType = (typeof BookingStatus)[keyof typeof BookingStatus];

export const BookingStatusLabels: Record<BookingStatusType, string> = {
  PENDING: "Awaiting Payment",
  PAID: "Paid",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const BookingStatusColors: Record<BookingStatusType, string> = {
  PENDING: "gray",
  PAID: "blue",
  CONFIRMED: "green",
  CANCELLED: "red",
  REFUNDED: "amber",
};
