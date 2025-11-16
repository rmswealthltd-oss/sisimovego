export const TRIP_STATUS = {
  CREATED: "CREATED",
  ASSIGNED: "ASSIGNED",
  ENROUTE: "ENROUTE",
  ARRIVED: "ARRIVED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
} as const;

export type TripStatus = typeof TRIP_STATUS[keyof typeof TRIP_STATUS];
