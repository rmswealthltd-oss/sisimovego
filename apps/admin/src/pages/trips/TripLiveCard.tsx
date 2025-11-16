import React, { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";

export default function TripLiveCard({ trip }: { trip: any }) {
  const socket = useSocket();
  const [status, setStatus] = useState(trip.status);

  useEffect(() => {
    if (!socket) return;
    socket.emit("subscribe:trip", { tripId: trip.id });

    socket.on("trip:status", (msg) => {
      if (msg.tripId === trip.id) setStatus(msg.status);
    });

    return () => {
      socket.emit("unsubscribe:trip", { tripId: trip.id });
    };
  }, [socket, trip.id]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Live Status</h3>
      <div className="text-lg capitalize">{status}</div>
      <div className="text-sm text-gray-500 mt-1">
        Updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
