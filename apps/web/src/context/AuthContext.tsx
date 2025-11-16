// apps/web/src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { clientGet } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user from backend using stored token
  async function restoreUser() {
    const token = storage.get("access");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const u = await clientGet("/auth/me", token);
      setUser(u);
    } catch (err) {
      storage.remove("access");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    restoreUser();
  }, []);

  // Login: save token + load user profile
  async function login(token: string) {
    storage.set("access", token);
    await restoreUser();
    router.push("/");
  }

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
