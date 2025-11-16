// apps/web/src/constants/tripStatus.ts

export const TripStatus = {
  PENDING: "PENDING",
  ASSIGNED: "ASSIGNED",
  STARTED: "STARTED",
  ARRIVED: "ARRIVED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type TripStatusType = (typeof TripStatus)[keyof typeof TripStatus];

export const TripStatusLabels: Record<TripStatusType, string> = {
  PENDING: "Pending",
  ASSIGNED: "Driver Assigned",
  STARTED: "On the way",
  ARRIVED: "Arrived",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const TripStatusColors: Record<TripStatusType, string> = {
  PENDING: "gray",
  ASSIGNED: "blue",
  STARTED: "green",
  ARRIVED: "orange",
  COMPLETED: "primary",
  CANCELLED: "red",
};
