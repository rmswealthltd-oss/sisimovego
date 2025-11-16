import { Api } from "./api";

/**
 * SWR/React Query compatible fetcher
 * Always performs a GET request through Api client.
 */
export const fetcher = (url: string) => Api.get(url);
