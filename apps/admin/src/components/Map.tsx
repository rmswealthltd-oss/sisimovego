import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  position: [number, number];
  icon?: string | React.ReactNode;
}

export interface MapProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  children?: React.ReactNode;
  className?: string;
}

export default function Map({
  center,
  zoom = 14,
  markers = [],
  children,
  className = "w-full h-full rounded-xl"
}: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className={className}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render custom / emoji markers */}
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={m.position}
          icon={L.divIcon({
            className: "",
            html: `<div style="font-size:22px">${m.icon ?? "📍"}</div>`
          })}
        />
      ))}

      {children}
    </MapContainer>
  );
}
