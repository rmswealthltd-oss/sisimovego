import { useEffect, useState, useRef } from "react";
import { Api } from "../lib/api";

/**
 * useApi
 * Auto-fetches data from API when `path` or deps change.
 * Returns { data, loading, error, refetch }
 */
export function useApi<T = any>(path: string | null, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(path));
  const [error, setError] = useState<any>(null);

  const controllerRef = useRef<AbortController | null>(null);

  async function fetchData(signal?: AbortSignal) {
    if (!path) return;

    setLoading(true);
    setError(null);

    try {
      const result = await Api.get(path);
      setData(result);
    } catch (err) {
      if (!(err as any).name === "AbortError") {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!path) return;

    const controller = new AbortController();
    controllerRef.current = controller;

    fetchData(controller.signal);

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(),
  };
}
