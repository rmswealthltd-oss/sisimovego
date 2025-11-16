// apps/web/src/app/trip/_components/DriverMarker.tsx
"use client";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

const DriverIcon = new L.Icon({
  iconUrl: "/icons/driver.png",
  iconSize: [36,36],
  iconAnchor: [18,36],
});

export default function DriverMarker({ position, driver }: { position: [number,number], driver?: any }) {
  return (
    <Marker position={position as [number,number]} icon={DriverIcon}>
      {driver && (
        <Popup>
          <div>
            <div className="font-medium">{driver.name}</div>
            <div className="text-sm text-gray-500">{driver.vehicle?.brand} • {driver.vehicle?.plate}</div>
          </div>
        </Popup>
      )}
    </Marker>
  );
}
