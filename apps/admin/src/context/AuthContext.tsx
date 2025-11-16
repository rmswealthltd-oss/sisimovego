import React, { createContext, useState, useEffect } from "react";
import { getToken, saveToken, clearToken, saveUser, getUser, setUserFromToken } from "../lib/auth";
import { Api } from "../lib/api";

type AuthContextType = {
  token: string | null;
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<any | null>(getUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      setUser(getUser());
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await Api.post("/auth/login", { email, password });
      const t = res.token;
      saveToken(t);
      setUserFromToken(t);
      setToken(t);
      setUser(getUser());
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ token, user, loading, login, logout }}>{children}</AuthContext.Provider>;
};
