"use client";

import {
  CreateCheckoutInput,
  CreateCheckoutResponse,
  Payment,
} from "../../types/payment";
import { TripView, BookingView, Role } from "../../types/trip";
import { storage } from "./storage";

const RAW_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3001";
const BASE_URL = `${RAW_URL}/api`;

type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
}

/** Build query string from params */
function buildQuery(params: Record<string, any> = {}) {
  const query = new URLSearchParams();
  for (const key in params) {
    const value = params[key];
    if (value !== undefined && value !== null) {
      query.append(key, value.toString());
    }
  }
  const str = query.toString();
  return str ? `?${str}` : "";
}

/** Main request function */
async function request<T>(
  method: ApiMethod,
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = storage.get<string>("access"); // automatically read token
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = BASE_URL + path + buildQuery(options.params);

  const res = await fetch(url, {
    method,
    headers,
    credentials: "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {}

  if (!res.ok) {
    const err: any = new Error(json?.message || "Request failed");
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json as T;
}

/** Exported API methods */
export const Api = {
  request,

  get<T>(path: string, options?: RequestOptions) {
    return request<T>("GET", path, options);
  },
  post<T>(path: string, body?: any, options?: RequestOptions) {
    return request<T>("POST", path, { ...options, body });
  },
  put<T>(path: string, body?: any, options?: RequestOptions) {
    return request<T>("PUT", path, { ...options, body });
  },
  patch<T>(path: string, body?: any, options?: RequestOptions) {
    return request<T>("PATCH", path, { ...options, body });
  },
  del<T>(path: string, options?: RequestOptions) {
    return request<T>("DELETE", path, options);
  },

  // --------------------------
  // Auth
  // --------------------------
  login(email: string, password: string) {
    return this.post<{ token: string; user: any }>("/auth/login", {
      email,
      password,
    });
  },
  logout() {
    return this.post("/auth/logout");
  },
  getMe() {
    return this.get<any>("/auth/me"); // token auto-attached
  },

  // --------------------------
  // Driver
  // --------------------------
  getDriverTrips() {
    return this.get<TripView[]>("/drivers/trips");
  },
  getDriverBookings() {
    return this.get<BookingView[]>("/drivers/bookings");
  },
  getWallet() {
    return this.get<{ balance: number }>("/drivers/wallet/me");
  },

  // --------------------------
  // Passenger
  // --------------------------
  getMyBookings() {
    return this.get<BookingView[]>("/passengers/bookings/my");
  },
  createBooking(data: { tripId: string; seats?: number }) {
    return this.post<BookingView>("/passengers/bookings", data);
  },
  cancelBooking(bookingId: string, reason?: string) {
    return this.post<BookingView>("/passengers/bookings/cancel", {
      bookingId,
      reason,
    });
  },

  // --------------------------
  // Trips
  // --------------------------
  getTrips(query?: Record<string, any>) {
    return this.get<TripView[]>("/trips", { params: query });
  },
  postTrip(data: Partial<TripView>) {
    return this.post<TripView>("/trips", data);
  },

  // --------------------------
  // Payments
  // --------------------------
  createCheckout(data: CreateCheckoutInput) {
    return this.post<CreateCheckoutResponse>(
      "/passengers/payments/checkout",
      data
    );
  },
  getPayment(id: string) {
    return this.get<Payment>(`/payments/${id}`);
  },
  getPaymentsForBooking(bookingId: string) {
    return this.get<Payment[]>(`/passengers/bookings/${bookingId}/payments`);
  },
};
