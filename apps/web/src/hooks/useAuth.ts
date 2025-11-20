"use client";

import { useEffect, useState, useCallback } from "react";
import { Api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { User } from "@/lib/User";

interface UseAuthResult {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (_email: string, _password: string) => Promise<boolean>;
  register: (_data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------
     Load token on mount
  ------------------------------------------- */
  useEffect(() => {
    const stored = storage.get<string>("token");  // <-- FIXED
    if (stored) {
      setToken(stored);
    }
    setLoading(false);
  }, []);

  /* ------------------------------------------
     Refresh user when token changes
  ------------------------------------------- */
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    refreshUser();
  }, [token]);

  /* ------------------------------------------
     Fetch authenticated user
  ------------------------------------------- */
  const refreshUser = useCallback(async () => {
    if (!token) return;

    try {
      const data = await Api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(data);
    } catch (err) {
      console.warn("Failed to refresh user:", err);
      logout();
    }
  }, [token]);

  /* ------------------------------------------
     LOGIN
  ------------------------------------------- */
  const login = async (_email: string, _password: string): Promise<boolean> => {
    setLoading(true);

    try {
      const data = await Api.post("/auth/login", {
        email: _email,
        password: _password
      });

      storage.set("token", data.token);
      setToken(data.token);
      router.push("/profile");

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------
     REGISTER
  ------------------------------------------- */
  const register = async (body: {
    name: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    setLoading(true);

    try {
      const data = await Api.post("/auth/register", body);

      storage.set("token", data.token);
      setToken(data.token);
      router.push("/profile");

      return true;
    } catch (err) {
      console.error("Registration error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------
     LOGOUT
  ------------------------------------------- */
  const logout = () => {
    storage.remove("token");
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  return {
    user,
    loading,
    token,
    login,
    register,
    logout,
    refreshUser
  };
}
