// apps/web/src/hooks/useTripRealtime.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { initSocket } from "../lib/socket";
import {
  parseDriverLocation,
  parseTripUpdate
} from "../lib/realtimeParser";

interface TripBuffer {
  loc?: any;
  trip?: any;
  status?: string | null;
}

export function useTripRealtime(tripId?: string | null) {
  const [connected, setConnected] = useState(false);
  const [driverLocation, setDriverLocation] = useState<any | null>(null);
  const [trip, setTrip] = useState<any | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const socketRef = useRef<any | null>(null);
  const bufferRef = useRef<TripBuffer>({});
  const flushTimerRef = useRef<any>(null);

  /* ------------------------ Batching Flush ------------------------ */
  function flushBuffer() {
    const buf = bufferRef.current;

    if (buf.loc) setDriverLocation(buf.loc);
    if (buf.trip) setTrip(prev => ({ ...(prev || {}), ...buf.trip }));
    if (buf.status !== undefined) setStatus(buf.status);

    bufferRef.current = {};
  }

  function scheduleFlush() {
    if (flushTimerRef.current) return; // already scheduled
    flushTimerRef.current = setTimeout(() => {
      flushTimerRef.current = null;
      flushBuffer();
    }, 200); // 200ms batch window for high-frequency events
  }

  /* ------------------------ Effect: Connect ------------------------ */
  useEffect(() => {
    if (!tripId) return;

    const socket = initSocket();
    socketRef.current = socket;

    /* --- Handlers --- */

    const handleConnect = () => {
      setConnected(true);
      socket.emit("subscribe:trip", { tripId });
      socket.emit("get:trip", { tripId }); // request initial state
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleLocation = (payload: any) => {
      const loc = parseDriverLocation(payload);
      if (!loc) return;
      bufferRef.current.loc = loc;
      scheduleFlush();
    };

    const handleTripUpdate = (payload: any) => {
      const parsed = parseTripUpdate(payload);
      if (!parsed) return;
      bufferRef.current.trip = parsed;
      scheduleFlush();
    };

    const handleStatus = (payload: any) => {
      const s = payload?.status ?? payload ?? null;
      bufferRef.current.status = s;
      scheduleFlush();
    };

    /* --- Register Listeners --- */

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("driver:location", handleLocation);
    socket.on("trip:update", handleTripUpdate);
    socket.on("trip:status", handleStatus);

    /* --- Cleanup --- */
    return () => {
      try {
        socket.emit("unsubscribe:trip", { tripId });
      } catch {}

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("driver:location", handleLocation);
      socket.off("trip:update", handleTripUpdate);
      socket.off("trip:status", handleStatus);

      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }

      socketRef.current = null;
    };
  }, [tripId]);

  return {
    connected,
    driverLocation,
    trip,
    status,
    socket: socketRef.current
  };
}
