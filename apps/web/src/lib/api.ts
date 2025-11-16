// apps/web/src/lib/api.ts
"use client";

import { ENDPOINTS } from "./config";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api";

/* ----------------------- CSRF ----------------------- */
function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )csrf_token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/* ---------------------- Refresh ---------------------- */
async function refreshToken() {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Refresh failed");
  return res.json();
}

/* -------------------- Core request -------------------- */
// automatically handles:
// - full URLs
// - retries once on 401
// - CSRF headers
// - JSON parsing fallback to text
async function request(path: string, opts: RequestInit = {}, retry = true): Promise<any> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const headers = new Headers(opts.headers ?? {});
  const csrf = getCsrfTokenFromCookie();
  if (csrf) headers.set("x-csrf-token", csrf);

  const finalOpts: RequestInit = {
    credentials: "include",
    ...opts,
    headers
  };

  const res = await fetch(url, finalOpts);

  // Parse JSON safely
  let text = "";
  try {
    text = await res.text();
  } catch {}

  let data: any;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  // retry on 401 once
  if (res.status === 401 && retry) {
    try {
      await refreshToken();
      return request(path, opts, false);
    } catch {
      /* continue to throw original 401 */
    }
  }

  if (!res.ok) {
    const err: any = new Error(data?.message || res.statusText || "API error");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/* ---------------------- Public API ---------------------- */
export const Api = {
  request,

  get(path: string) {
    return request(path, { method: "GET" });
  },

  post(path: string, body?: any) {
    const isForm = body instanceof FormData;
    return request(path, {
      method: "POST",
      body: isForm ? body : JSON.stringify(body),
      headers: isForm ? undefined : { "Content-Type": "application/json" }
    });
  },

  put(path: string, body?: any) {
    return request(path, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    });
  },

  delete(path: string) {
    return request(path, { method: "DELETE" });
  },

  /* ------------------- Auth helpers ------------------- */
  async getMe() {
    return this.get("/auth/me");
  },

  /* ------------------- Booking helpers ------------------- */
  async createBooking(payload: {
    tripId: string;
    seats: number;
    passengerInfo?: any;
    promo?: string;
  }) {
    return this.post("/bookings/create", payload);
  },

  async getBooking(bookingId: string) {
    return this.get(`/bookings/${encodeURIComponent(bookingId)}`);
  },

  /* ------------------- Promo helpers ------------------- */
  async applyPromo(payload: { code: string; tripId?: string; bookingId?: string }) {
    return this.post("/promos/apply", payload);
  },

  /* ------------------- Payment helpers ------------------- */
  async createCheckout(payload: {
    bookingId: string;
    method: "mpesa" | "stripe";
  }) {
    return this.post("/payments/checkout", payload);
  },

  /* ------------------- Trips ------------------- */
  async getTrip(id: string) {
    return this.get(`/trips/${id}`);
  },

  /* ---------------- Push Subscriptions ---------------- */
  async saveSubscription(subscription: any) {
    return this.post("/push/subscribe", { subscription });
  },

  async getSubscriptions() {
    return this.get("/push/subscriptions");
  },

  async deleteSubscription(idOrEndpoint: string) {
    return this.delete(`/push/subscriptions/${encodeURIComponent(idOrEndpoint)}`);
  }
};
