"use client";

import { FiMenu } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useUserRole } from "@/context/UserRoleContext";

export default function DashboardHeader({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const { user, logout, loading } = useAuth();
  const { role } = useUserRole();

  // Prevent hydration mismatch just like the main header
  if (loading) {
    return (
      <header className="w-full h-16 bg-white border-b shadow-sm"></header>
    );
  }

  return (
    <header className="w-full bg-white border-b shadow-sm h-16 flex items-center sticky top-0 z-40">
      <div className="flex items-center justify-between w-full px-4 md:px-6">

        {/* Sidebar toggle (mobile only) */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-md border bg-gray-100 hover:bg-gray-200"
        >
          <FiMenu size={22} />
        </button>

        {/* Dashboard Title */}
        <h1 className="font-semibold text-lg text-gray-800">
          Dashboard
        </h1>

        {/* User section */}
        <div className="flex items-center gap-4">
          {/* Role badge */}
          {role && (
            <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600 capitalize">
              {role}
            </span>
          )}

          {/* User Name */}
          {user && (
            <span className="text-sm font-medium text-gray-700">
              {user.lastName}
            </span>
          )}

          {/* Logout */}
          {user && (
            <button
              onClick={logout}
              className="text-sm px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
