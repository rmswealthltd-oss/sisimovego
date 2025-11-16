"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { storage } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { User } from "@/lib/User";

interface UseAuthResult {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

/**
 * Authentication Hook
 * -------------------
 * Handles:
 *  - login
 *  - logout
 *  - register
 *  - token storage
 *  - fetching user profile
 *  - sync with API + storage
 */
export function useAuth(): UseAuthResult {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load token from LocalStorage on first mount
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = storage.get("token");
    if (stored) {
      setToken(stored);
    }

    setLoading(false);
  }, []);

  /**
   * Fetch profile when token changes
   */
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    refreshUser();
  }, [token]);

  /**
   * Fetch authenticated user profile
   */
  const refreshUser = useCallback(async () => {
    if (!token) return;

    try {
      const res = await apiFetch("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        // token invalid → logout
        logout();
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      logout();
    }
  }, [token]);

  /**
   * Login
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return false;
      }

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

  /**
   * Register
   */
  const register = async (body: {
    name: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    setLoading(true);

    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return false;
      }

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

  /**
   * Logout
   */
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
