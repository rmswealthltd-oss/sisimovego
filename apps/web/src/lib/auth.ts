import { storage } from "./storage";
const TOKEN_KEY = "sisimove_token";

export function saveToken(token: string) { storage.set(TOKEN_KEY, token); }
export function getToken() { return storage.get(TOKEN_KEY); }
export function clearToken() { storage.remove(TOKEN_KEY); }

export async function login(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api"}/auth/login`, {
    method: "POST", body: JSON.stringify({ email, password }), headers: { "Content-Type": "application/json" }
  });
  const data = await res.json();
  if (!res.ok) throw data;
  saveToken(data.token);
  return data;
}
