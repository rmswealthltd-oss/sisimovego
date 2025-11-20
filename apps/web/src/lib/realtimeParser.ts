// apps/web/src/lib/realtimeParser.ts
export function parseDriverLocation(payload: any) {
  if (!payload) return null;
  const lat = Number(payload.lat ?? payload.latitude ?? payload.lat_gps);
  const lng = Number(payload.lng ?? payload.longitude ?? payload.lng_gps);
  const ts = payload.ts ?? payload.time ?? new Date().toISOString();
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng, ts, driverId: payload.driverId ?? payload.driver_id ?? payload.driver?.id };
}

export function parseTripUpdate(payload: any) {
  if (!payload) return null;
  return {
    id: payload.id ?? payload.tripId ?? payload.trip_id,
    status: payload.status ?? payload.state,
    driver: payload.driver ?? payload.driver_info,
    route: payload.route ?? payload.polyline ?? payload.path
  };
}
