// apps/web/src/app/trip/[tripId]/realtime/ClientWrapper.tsx
"use client";
import Map from "@/components/Map";
import DriverMarker from "@/components/DriverMarker";
import { useTripRealtime } from "@/hooks/useTripRealtime";
import React from "react";

export default function ClientWrapper({ tripId }: { tripId: string }) {
  const { driverLocation, trip } = useTripRealtime(tripId);

  const center: [number, number] = driverLocation ? [driverLocation.lat, driverLocation.lng] : (trip?.origin?.lat ? [trip.origin.lat, trip.origin.lng] : [0,0]);

  return (
    <div className="h-96 rounded overflow-hidden shadow">
      <Map center={center} zoom={13} autoFollow followPosition={driverLocation ? [driverLocation.lat, driverLocation.lng] : null}>
        {driverLocation && <DriverMarker position={[driverLocation.lat, driverLocation.lng]} />}
      </Map>
    </div>
  );
}
