// apps/web/src/hooks/useBookings.ts
"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export function useBookings(page = 1, limit = 10) {
  const { data, error, isLoading } = useSWR(
    `/api/bookings?page=${page}&limit=${limit}`,
    fetcher,
    { refreshInterval: 10_000 }
  );

  return {
    bookings: data?.items ?? [],
    total: data?.total ?? 0,
    error,
    isLoading,
  };
}
