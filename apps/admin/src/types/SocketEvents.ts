export type SocketTripStatusPayload = { tripId: string; status: string; at?: string };
export type SocketDriverLocationPayload = { driverId: string; lat: number; lng: number; ts?: string };

export interface SocketEvents {
  "trip:status": (payload: SocketTripStatusPayload) => void;
  "driver:location": (payload: SocketDriverLocationPayload) => void;
  // add more as needed
}
