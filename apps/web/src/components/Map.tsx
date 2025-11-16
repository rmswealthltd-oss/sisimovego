// apps/web/src/components/Map.tsx
"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Must import Leaflet CSS only inside client component
import "leaflet/dist/leaflet.css";

/* -------------------------------------------------
   FIX DEFAULT MARKER ICONS (Leaflet bug in bundlers)
-------------------------------------------------- */
const DefaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

/* -------------------------------------------------
   Fit to bounds
-------------------------------------------------- */
function FitController({ coords }: { coords?: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !coords || coords.length === 0) return;

    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds.pad(0.15));
  }, [coords, map]);

  return null;
}

/* -------------------------------------------------
   MAP COMPONENT
-------------------------------------------------- */
export default function Map({
  center = [0, 0],
  zoom = 13,
  markers = [],
  fitBounds = false,
  children
}: {
  center?: [number, number];
  zoom?: number;
  markers?: { lat: number; lng: number; popup?: React.ReactNode }[];
  fitBounds?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {fitBounds && markers.length > 0 && (
        <FitController coords={markers.map(m => [m.lat, m.lng])} />
      )}

      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]}>
          {m.popup && <Popup>{m.popup}</Popup>}
        </Marker>
      ))}

      {children}
    </MapContainer>
  );
}
