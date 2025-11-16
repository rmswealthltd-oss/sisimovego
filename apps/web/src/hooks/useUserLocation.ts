// apps/web/src/hooks/useUserLocation.ts
"use client";

import { useEffect, useState } from "react";

export function useUserLocation() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not available");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );

    setWatchId(id);

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { position, error };
}
