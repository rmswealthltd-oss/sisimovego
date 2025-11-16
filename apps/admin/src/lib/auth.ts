import { storage } from "./storage";

const TOKEN_KEY = "admin_token";
const USER_KEY = "admin_user";

// ------------------------------------
// TOKEN
// ------------------------------------

// alias names for compatibility with older code
export function saveToken(token: string) {
  storage.set(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return storage.get(TOKEN_KEY);
}

export function clearToken() {
  storage.remove(TOKEN_KEY);
  storage.remove(USER_KEY);
}

// ------------------------------------
// USER
// ------------------------------------

// alias names for compatibility
export function saveUser(user: any) {
  storage.set(USER_KEY, user);
}

export function getUser() {
  return storage.get(USER_KEY) ?? null;
}

// Optional helper: extract user info from JWT payload
export function setUserFromToken(token: string) {
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return;

    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    saveUser({
      name: payload.name || payload.email,
      email: payload.email,
      sub: payload.sub,
      role: payload.role,
    });
  } catch {
    // ignore
  }
}

// ------------------------------------
// LOGOUT
// ------------------------------------

export function logout(redirect = true) {
  clearToken();
  if (redirect) window.location.href = "/login";
}
