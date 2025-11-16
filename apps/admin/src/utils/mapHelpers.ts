import L from "leaflet";
import { LatLng } from "../types/Trip";

/**
 * Fit map bounds for a list of lat/lngs.
 */
export function fitBounds(map: L.Map, coords: LatLng[]) {
  if (!coords || !coords.length) return;
  const latlngs = coords.map((c) => L.latLng(c.lat, c.lng));
  const bounds = L.latLngBounds(latlngs);
  map.fitBounds(bounds.pad(0.2));
}

/**
 * Create a simple route polyline between coordinates.
 */
export function drawRoute(map: L.Map, coords: LatLng[]) {
  const latlngs = coords.map((c) => [c.lat, c.lng] as [number, number]);
  const poly = L.polyline(latlngs, { color: "#2563EB", weight: 4, opacity: 0.9 }).addTo(map);
  return poly;
}
