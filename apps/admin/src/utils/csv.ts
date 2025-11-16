/**
 * Simple CSV serializer from array of objects.
 * - keys: array of column keys (order)
 * - rows: array of objects
 */
export function toCSV(keys: string[], rows: Record<string, any>[]) {
  const esc = (v: any) => {
    if (v == null) return "";
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const header = keys.join(",");
  const out = rows.map((r) => keys.map((k) => esc(r[k])).join(","));
  return [header, ...out].join("\n");
}
