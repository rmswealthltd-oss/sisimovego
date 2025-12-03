"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

// These are your SisiMove roles
export type Role = "driver" | "passenger" | "admin" | null;

interface UserRoleContextType {
  role: Role;
  setRole: (r: Role) => void;
}

const UserRoleContext = createContext<UserRoleContextType>({
  role: null,
  setRole: () => {},
});

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [role, setRole] = useState<Role>(null);

  /* ----------------------------------------
     Automatically derive role from backend
     (extend this later based on your API)
  ----------------------------------------- */
  useEffect(() => {
    if (!user) {
      setRole(null);
      return;
    }

    // TEMP LOGIC — replace when your backend exposes user.role
    if (user.email === "admin@sisimove.com") setRole("admin");
    else setRole("passenger");

  }, [user]);

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  return useContext(UserRoleContext);
}
