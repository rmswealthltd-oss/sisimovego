// apps/web/src/hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { User } from "../../types/user";

interface UseAuthResult {
  user: User | null;
  loading: boolean;
  token: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterInput) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (u: User | null) => void;
}

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function useAuth(): UseAuthResult {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------------
     Load token on first page load
  ----------------------------------------- */
  useEffect(() => {
    const savedToken = storage.get<string>("token");
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  /* ----------------------------------------
     Automatically refresh user when token changes
  ----------------------------------------- */
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    refreshUser();
  }, [token]);

  /* ----------------------------------------
     Refresh /auth/me
  ----------------------------------------- */
  const refreshUser = useCallback(async () => {
    if (!token) return;

    try {
      const res = await Api.get<{ user: User }>("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const u = res.user;

      setUser({
        ...u,
        fullName: `${u.firstName} ${u.lastName}`,
      });
    } catch (err) {
      console.error("refreshUser failed", err);
      logout();
    }
  }, [token]);

  /* ----------------------------------------
     Login
  ----------------------------------------- */
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { token: newToken, user: u } = await Api.post<{
        token: string;
        user: User;
      }>("/auth/login", { email, password });

      storage.set("token", newToken);
      setToken(newToken);

      setUser({
        ...u,
        fullName: `${u.firstName} ${u.lastName}`,
      });

      router.replace("/dashboard");
      return true;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------
     Register
  ----------------------------------------- */
  const register = async (data: RegisterInput): Promise<boolean> => {
    setLoading(true);
    try {
      const { token: newToken, user: u } = await Api.post<{
        token: string;
        user: User;
      }>("/auth/register", data);

      storage.set("token", newToken);
      setToken(newToken);

      setUser({
        ...u,
        fullName: `${u.firstName} ${u.lastName}`,
      });

      router.replace("/dashboard");
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------
     Logout
  ----------------------------------------- */
  const logout = () => {
    storage.remove("token");
    setToken(null);
    setUser(null);
    router.replace("/auth/login");
  };

  /* ----------------------------------------
     Return hook state
  ----------------------------------------- */
  return {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser,
    setUser,
  };
}
