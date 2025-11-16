import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

/**
 * useQueryParams
 * Small helper to read/write query params as an object.
 */
export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = useCallback(
    (key?: string) => {
      if (!key) {
        const obj: Record<string, string> = {};
        for (const [k, v] of searchParams.entries()) obj[k] = v;
        return obj;
      }
      return searchParams.get(key);
    },
    [searchParams]
  );

  const set = useCallback(
    (obj: Record<string, any>, opts?: { replace?: boolean }) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(obj).forEach(([k, v]) => {
        if (v == null || v === "") next.delete(k);
        else next.set(k, String(v));
      });
      setSearchParams(next, { replace: opts?.replace });
    },
    [searchParams, setSearchParams]
  );

  return { get, set };
}
