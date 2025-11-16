// apps/web/src/lib/config.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api";

export const ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE}/auth/login`,
  AUTH_ME: `${API_BASE}/auth/me`,
  AUTH_REFRESH: `${API_BASE}/auth/refresh`,
  TRIPS_SEARCH: `${API_BASE}/trips/search`,
  TRIP_GET: (id: string) => `${API_BASE}/trips/${encodeURIComponent(id)}`,
  BOOKINGS_CREATE: `${API_BASE}/bookings/create`,
  BOOKINGS_MY: `${API_BASE}/bookings/mine`,
  PAYMENTS_CHECKOUT: `${API_BASE}/payments/checkout`,
  MPESA_STATUS: (checkoutId: string) => `${API_BASE}/payments/mpesa/status?checkoutId=${encodeURIComponent(checkoutId)}`,
  PUSH_SUBSCRIBE: `${API_BASE}/push/subscribe`,
  PUSH_LIST: `${API_BASE}/push/subscriptions`,
};
