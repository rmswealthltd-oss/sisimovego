import { createContext, useContext, useState, useEffect } from "react";
import { Api } from "../lib/api";
import { getToken, saveToken, clearToken } from "../lib/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on startup if token exists
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    Api.get("/auth/me")
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const response = await Api.post("/auth/login", { email, password });

    if (!response.token) {
      throw new Error("Login failed: No token returned");
    }

    saveToken(response.token);
    setUser(response.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be inside <AuthProvider>");
  return ctx;
};
