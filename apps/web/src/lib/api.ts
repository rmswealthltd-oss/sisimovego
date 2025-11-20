"use client";

// -------------------------------------------------------------
//  Production-Ready API Client for Next.js
//  Uses Bearer token stored in localStorage
// -------------------------------------------------------------

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

/* ---------------------------------------------------------
   Helper: token accessor (browser only)
---------------------------------------------------------- */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/* ---------------------------------------------------------
   Core request wrapper
---------------------------------------------------------- */
async function request(
  method: string,
  url: string,
  body?: any,
  options: { headers?: Record<string, string> } = {}
) {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    const msg = json?.message || json?.error || res.statusText;
    const error = new Error(msg);
    (error as any).data = json;
    (error as any).status = res.status;
    throw error;
  }

  return json;
}

/* ---------------------------------------------------------
   Public API surface
---------------------------------------------------------- */
export const Api = {
  get(path: string, options: any = {}) {
    return request("GET", path, undefined, options);
  },

  post(path: string, body?: any, options: any = {}) {
    return request("POST", path, body, options);
  },

  put(path: string, body?: any, options: any = {}) {
    return request("PUT", path, body, options);
  },

  patch(path: string, body?: any, options: any = {}) {
    return request("PATCH", path, body, options);
  },

  delete(path: string, options: any = {}) {
    return request("DELETE", path, undefined, options);
  },

  // ---------------- AUTH ----------------
  getMe() {
    return this.get("/auth/me");
  },

  // ---------------- BOOKING ----------------
  createBooking(payload: {
    tripId: string;
    seats: number;
    passengerInfo?: any;
    promo?: string;
  }) {
    return this.post("/bookings/create", payload);
  },

  getBooking(id: string) {
    return this.get(`/bookings/${encodeURIComponent(id)}`);
  },

  // ---------------- PROMO ----------------
  applyPromo(payload: { code: string; tripId?: string; bookingId?: string }) {
    return this.post("/promos/apply", payload);
  },

  // ---------------- PAYMENTS ----------------
  createCheckout(payload: {
    bookingId: string;
    method: "mpesa" | "stripe";
  }) {
    return this.post("/payments/checkout", payload);
  },

  // ---------------- TRIPS ----------------
  getTrip(id: string) {
    return this.get(`/trips/${id}`);
  },

  // ---------------- PUSH SUBSCRIPTIONS ----------------
  saveSubscription(subscription: any) {
    return this.post("/push/subscribe", { subscription });
  },

  getSubscriptions() {
    return this.get("/push/subscriptions");
  },

  deleteSubscription(idOrEndpoint: string) {
    return this.delete(
      `/push/subscriptions/${encodeURIComponent(idOrEndpoint)}`
    );
  },
};
