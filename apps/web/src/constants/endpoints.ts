export const ENDPOINTS = {
  TRIPS_SEARCH: "/trips/search",
  TRIPS_FEATURED: "/trips/featured",
  TRIP: (id: string) => `/trips/${id}`,
  BOOKING_CREATE: "/bookings",
  AUTH_LOGIN: "/auth/login",
  AUTH_ME: "/auth/me"
};
