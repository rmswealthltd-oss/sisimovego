// apps/web/src/lib/serverApi.ts
import { cookies } from "next/headers";
import { ENDPOINTS } from "./config";

/**
 * serverFetch - server-side wrapper that forwards user's access token (from cookie)
 * to the API as Authorization: Bearer <token>.
 *
 * Assumes access token is stored in cookie named "sisimove_access".
 * If your cookie name differs, replace the cookie name here.
 */

const ACCESS_COOKIE_NAME = "sisimove_access";
const REFRESH_COOKIE_NAME = "sisimove_refresh";

async function serverFetch(url: string, opts: RequestInit = {}) {
  // get cookies from incoming request
  const ck = cookies();
  const access = ck.get(ACCESS_COOKIE_NAME)?.value ?? null;

  const headers = new Headers(opts.headers ?? {});
  if (access) {
    headers.set("authorization", `Bearer ${access}`);
  }

  const final: RequestInit = {
    credentials: "include", // pass cookies if same-origin
    ...opts,
    headers,
  };

  const res = await fetch(url, final);
  // if unauthorized, we try a refresh once (best-effort)
  if (res.status === 401) {
    // try refresh endpoint using refresh cookie (server-side)
    const refresh = ck.get(REFRESH_COOKIE_NAME)?.value ?? null;
    if (refresh) {
      // call auth refresh endpoint on your API; it should rotate cookies or return a new access token
      try {
        const r = await fetch(ENDPOINTS.AUTH_REFRESH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: refresh }),
          credentials: "include",
        });
        if (r.ok) {
          // after refresh, retry original request once (assumes server set new cookie)
          const access2 = cookies().get(ACCESS_COOKIE_NAME)?.value ?? null;
          if (access2) {
            headers.set("authorization", `Bearer ${access2}`);
            const retryRes = await fetch(url, { ...final, headers });
            return retryRes;
          }
        }
      } catch (e) {
        // ignore refresh errors; fall through to return original res
      }
    }
  }
  return res;
}

export async function apiGet(path: string) {
  const url = path.startsWith("http") ? path : `${path}`;
  const res = await serverFetch(url, { method: "GET" });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export async function apiPost(path: string, body: any) {
  const url = path.startsWith("http") ? path : `${path}`;
  const res = await serverFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}
