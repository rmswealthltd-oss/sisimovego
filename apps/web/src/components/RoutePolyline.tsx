// apps/web/src/components/RoutePolyline.tsx
"use client";

import { useEffect } from "react";
import { Polyline, useMap } from "react-leaflet";
import L from "leaflet";

export default function RoutePolyline({ coords, fitBounds = true }: { coords: Array<[number, number]>; fitBounds?: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !coords || coords.length === 0) return;
    if (fitBounds) {
      const bounds = L.latLngBounds(coords.map((c) => L.latLng(c[0], c[1])));
      map.fitBounds(bounds.pad(0.15));
    }
  }, [coords?.length]);

  return coords && coords.length ? (
    <Polyline positions={coords} pathOptions={{ color: "#2563EB", weight: 4, opacity: 0.9 }} />
  ) : null;
}
