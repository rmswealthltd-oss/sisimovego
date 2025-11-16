import React, { useEffect, useState } from "react";
import Map from "../../components/Map";
import DriverMarker from "../../components/DriverMarker";
import { useSocket } from "../../hooks/useSocket";

export default function TripMapOps({ trip }: { trip: any }) {
  const socket = useSocket();
  const [driverPos, setDriverPos] = useState(trip.driverLocation || null);

  useEffect(() => {
    if (!socket || !trip.driverId) return;

    socket.emit("subscribe:driver", { driverId: trip.driverId });

    socket.on("driver:location", (loc) => {
      if (loc.driverId === trip.driverId) setDriverPos(loc);
    });

    return () => {
      socket.emit("unsubscribe:driver", { driverId: trip.driverId });
    };
  }, [socket, trip.driverId]);

  return (
    <div className="bg-white rounded shadow p-2">
      <h3 className="font-semibold mb-2">Map</h3>
      <div className="h-80 rounded overflow-hidden">
        <Map
          center={[trip.origin.lat, trip.origin.lng]}
          markers={[
            {
              id: "origin",
              position: [trip.origin.lat, trip.origin.lng],
              icon: "🟢"
            },
            {
              id: "destination",
              position: [trip.destination.lat, trip.destination.lng],
              icon: "🏁"
            }
          ]}
        >
          {driverPos && (
            <DriverMarker position={[driverPos.lat, driverPos.lng]} driver={trip.driver} />
          )}
        </Map>
      </div>
    </div>
  );
}
