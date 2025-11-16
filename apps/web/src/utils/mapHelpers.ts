// apps/web/src/utils/mapHelpers.ts

// Calculate distance in KM using Haversine
export function haversineDistance(
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number]
) {
  const R = 6371; // km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function deg2rad(d: number) {
  return (d * Math.PI) / 180;
}

// Estimate ETA (minutes)
export function estimateETA(distanceKm: number, speedKmh = 40) {
  const hours = distanceKm / speedKmh;
  return Math.round(hours * 60); // minutes
}

// Get midpoint of route
export function midpoint(
  start: [number, number],
  end: [number, number]
): [number, number] {
  return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
}

// Compute bounding box for map auto-fit
export function computeBounds(points: [number, number][]) {
  if (points.length === 0) return null;

  let minLat = 90,
    maxLat = -90,
    minLng = 180,
    maxLng = -180;

  for (const [lat, lng] of points) {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ] as [[number, number], [number, number]];
}
