import useSWR from "swr";
import { Api } from "@/lib/api";

export function useBookings(page = 1, limit = 10) {
  const { data, error, isLoading } = useSWR(
    `/bookings?page=${page}&limit=${limit}`,
    () => Api.get(`/bookings?page=${page}&limit=${limit}`)
  );

  return {
    bookings: data?.data || [],
    total: data?.total || 0,
    error,
    isLoading,
  };
}
