// src/types/Booking.ts

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PAID"
  | "CANCELLED"
  | "REFUNDED"
  | "COMPLETED";

export interface BookingSummary {
  id: string;
  tripId: string;
  passengerId: string;

  seats: number;

  status: BookingStatus;

  amountPaid: number; // stored as cents in DB → integer
}
