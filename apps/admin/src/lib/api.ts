import { getToken } from "./auth";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

export const Api = {
  async request(path: string, options: RequestInit = {}) {
    const token = getToken();

    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
      ...(options.headers || {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      ...options,
      headers,
    });

    // Try to parse JSON, fallback to empty object
    let data: any;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      const err: any = new Error(data.message || "API Error");
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  },

  get(path: string) {
    return Api.request(path, { method: "GET" });
  },

  post(path: string, body?: any) {
    return Api.request(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  put(path: string, body?: any) {
    return Api.request(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  patch(path: string, body?: any) {
    return Api.request(path, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  delete(path: string) {
    return Api.request(path, { method: "DELETE" });
  },
};
