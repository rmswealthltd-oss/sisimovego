// apps/web/src/components/Map.tsx
"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Fix Leaflet icons */
const DefaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

/* Fit bounds */
function FitController({ coords }: { coords?: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !coords || coords.length === 0) return;
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds.pad(0.15));
  }, [coords, map]);

  return null;
}

/* Auto-follow driver */
function AutoFollowController({
  active,
  position
}: {
  active?: boolean;
  position?: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !active || !position) return;
    map.setView(position, map.getZoom(), { animate: true });
  }, [active, position, map]);

  return null;
}

/* MAIN MAP COMPONENT */
export default function Map({
  center = [0, 0],
  zoom = 13,
  markers = [],
  fitBounds = false,
  children,
  height = "100%",

  // ⭐ NEW PROPS
  autoFollow = false,
  followPosition = null
}: {
  center?: [number, number];
  zoom?: number;
  markers?: { lat: number; lng: number; popup?: React.ReactNode }[];
  fitBounds?: boolean;
  children?: React.ReactNode;
  height?: string;

  autoFollow?: boolean;
  followPosition?: [number, number] | null;
}) {
  return (
    <div style={{ height, width: "100%" }}>
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

        {autoFollow && followPosition && (
          <AutoFollowController active={autoFollow} position={followPosition} />
        )}

        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]}>
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ))}

        {children}
      </MapContainer>
    </div>
  );
}
