// apps/web/src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { Api } from "@/lib/api";
import { User } from "../../types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
  refreshUser: async () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Load token from storage on mount
  useEffect(() => {
    const savedToken = storage.get<string>("token");
    if (savedToken) setToken(savedToken);
    setLoading(false);
  }, []);

  // Refresh user when token changes
  useEffect(() => {
    if (token) {
      refreshUser();
    } else {
      setUser(null);
    }
  }, [token]);

  const refreshUser = useCallback(async () => {
    if (!token) return;

    try {
      const res = await Api.getMe(); // returns { user: User }
      const u = res.user;
      setUser({ ...u, fullName: `${u.firstName} ${u.lastName}` });
    } catch (err) {
      console.error("Failed to refresh user:", err);
      logout();
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token: newToken } = await Api.login(email, password);
      storage.set("token", newToken);
      setToken(newToken);
      await refreshUser();
      router.replace("/dashboard");
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshUser, router]);

  const logout = useCallback(() => {
    storage.remove("token");
    setToken(null);
    setUser(null);
    router.replace("/auth/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to access AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
