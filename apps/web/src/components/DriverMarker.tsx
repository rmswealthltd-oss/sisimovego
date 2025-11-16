// apps/web/src/components/DriverMarker.tsx
"use client";

import { useEffect, useRef } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";

type Driver = {
  id?: string;
  name?: string;
  avatarUrl?: string | null;
  phone?: string;
};

export default function DriverMarker({
  position,
  driver,
  title
}: {
  position: [number, number];
  driver?: Driver | null;
  title?: string;
}) {
  const map = useMap();
  const markerRef = useRef<L.Marker<any> | null>(null);

  // create a divIcon with avatar and label
  const icon = L.divIcon({
    className: "driver-marker",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center">
        <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.2)">
          <img src="${driver?.avatarUrl ?? "/icons/driver.png"}" style="width:40px;height:40px;object-fit:cover" />
        </div>
        <div style="background:rgba(0,0,0,0.6);color:white;padding:2px 6px;border-radius:6px;margin-top:6px;font-size:11px">${(driver?.name ?? title ?? "Driver")}</div>
      </div>
    `,
    iconSize: [40, 58],
    iconAnchor: [20, 58]
  });

  useEffect(() => {
    // animate smoothly by setting marker position using small steps
    if (!markerRef.current) return;
    const marker = markerRef.current;
    const currentLatLng = marker.getLatLng();
    const targetLatLng = L.latLng(position[0], position[1]);

    const duration = 600; // ms
    const frames = Math.max(6, Math.round((duration / 16)));
    let frame = 0;
    const latDiff = (targetLatLng.lat - currentLatLng.lat) / frames;
    const lngDiff = (targetLatLng.lng - currentLatLng.lng) / frames;

    const step = () => {
      frame++;
      const next = L.latLng(
        currentLatLng.lat + latDiff * frame,
        currentLatLng.lng + lngDiff * frame
      );
      marker.setLatLng(next);
      if (frame < frames) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [position]);

  return (
    <Marker
      ref={(m) => {
        if (!m) return;
        markerRef.current = m as any;
      }}
      position={position}
      icon={icon}
      eventHandlers={{
        add: () => {
          // keep view inside bounds (optional)
        }
      }}
    />
  );
}
