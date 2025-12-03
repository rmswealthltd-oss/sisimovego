// apps/web/src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { storage } from "@/lib/storage";
import { Api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;           // ✅ add phone
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (_token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  refreshUser: async () => {},       // default
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* ----------------------------------------
     Restore user from stored token
  ----------------------------------------- */
  async function restoreUser() {
    const token = storage.get("access");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const u = await Api.get("/auth/me");
      setUser(u);
    } catch {
      storage.remove("access");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    restoreUser();
  }, []);

  /* ----------------------------------------
     Add refreshUser
  ----------------------------------------- */
  async function refreshUser() {
    try {
      const u = await Api.get("/auth/me");
      setUser(u);
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  }

  /* ----------------------------------------
     Login
  ----------------------------------------- */
  async function login(token: string) {
    storage.set("access", token);
    await restoreUser();
    router.push("/");
  }

  /* ----------------------------------------
     Logout
  ----------------------------------------- */
  function logout() {
    storage.remove("access");
    setUser(null);
    router.push("/auth/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,  // ✅ exposed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
