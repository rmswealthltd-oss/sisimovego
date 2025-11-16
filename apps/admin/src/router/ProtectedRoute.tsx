import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { routes } from "./routes";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While checking token/user → show a centered loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking session...
      </div>
    );
  }

  // If not authenticated → redirect to login
  if (!user) {
    return (
      <Navigate
        to={routes.login}
        replace
        state={{ from: location }} // preserve original path
      />
    );
  }

  // Authenticated → render child route
  return <>{children}</>;
}
