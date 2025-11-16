import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Api } from "../lib/api";

/**
 * Hook: returns the auth context value.
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * loginRequest
 * Calls your API login route and returns `{ token, user }` or error.
 */
export function loginRequest({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return Api.post("/auth/login", { email, password });
}
