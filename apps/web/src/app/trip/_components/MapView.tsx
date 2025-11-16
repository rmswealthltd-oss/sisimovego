// apps/web/src/app/trip/_components/MapView.tsx
"use client";
import Map from "@/components/Map";

export default function MapView({ coords, markers }: { coords?: [number, number][], markers?: any[] }) {
  const center = markers?.[0] ? [markers[0].lat, markers[0].lng] : (coords?.[0] ?? [0,0]);
  return (
    <div className="h-64">
      <Map center={center as [number,number]} zoom={12} markers={markers} fitBounds />
    </div>
  );
}
