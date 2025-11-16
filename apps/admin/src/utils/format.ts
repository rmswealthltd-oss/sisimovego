import { format } from "date-fns";

/**
 * formatDate: ISO | Date -> "yyyy-MM-dd"
 */
export function formatDateISO(v?: string | Date) {
  if (!v) return "";
  return format(new Date(v), "yyyy-MM-dd");
}

/**
 * formatDateTime: human readable
 */
export function formatDateTime(v?: string | Date) {
  if (!v) return "";
  return format(new Date(v), "yyyy-MM-dd HH:mm:ss");
}
