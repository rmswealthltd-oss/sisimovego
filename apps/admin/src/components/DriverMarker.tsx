import React, { useMemo } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

export interface DriverMarkerProps {
  position: [number, number];
  driver: {
    name?: string;
    avatarUrl?: string;
  };
}

export default function DriverMarker({ position, driver }: DriverMarkerProps) {
  const icon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div style="
              width:32px;
              height:32px;
              border-radius:50%;
              overflow:hidden;
              border:2px solid white;
              box-shadow:0 0 4px rgba(0,0,0,0.2);
            ">
            <img 
              src="${driver.avatarUrl ?? "/default-avatar.png"}" 
              style="width:100%;height:100%;object-fit:cover;" 
            />
          </div>
          <div style="
              margin-top:3px;
              font-size:10px;
              background:rgba(0,0,0,0.65);
              color:white;
              padding:1px 4px;
              border-radius:4px;
              white-space:nowrap;
            ">
            ${driver.name ?? "Driver"}
          </div>
        </div>
      `,
      }),
    [driver]
  );

  return <Marker position={position} icon={icon} />;
}
