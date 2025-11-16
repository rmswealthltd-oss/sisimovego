// apps/web/src/lib/map.ts
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Generate n intermediate points between a -> b (lat/lng) */
export function interpolatePoints(a: [number, number], b: [number, number], steps = 6) {
  const out: [number, number][] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / (steps + 1);
    out.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t)]);
  }
  return out;
}
