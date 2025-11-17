const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

export const Api = {
  async request(path: string, options: RequestInit = {}) {
    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
      ...(options.headers || {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      // ❌ NO Authorization header — we use cookies only
    };

    const res = await fetch(`${API_BASE}${path}`, {
      method: options.method,
      credentials: "include", // ⭐ REQUIRED — sends auth cookie
      headers,
      body: options.body,
    });

    // Parse JSON response
    let data: any;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    // Throw API errors
    if (!res.ok) {
      const err = new Error(data.message || "API Error") as any;
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
