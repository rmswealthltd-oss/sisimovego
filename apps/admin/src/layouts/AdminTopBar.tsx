import React from "react";
import { Bell, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";

export default function AdminTopBar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const toast = useToast();

  return (
    <header className="h-14 px-6 flex items-center justify-between bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      {/* Left: Title */}
      <div>
        <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Africa-first — SisiMove
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">

        {/* Test Toast */}
        <button
          className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm"
          onClick={() =>
            toast.show({
              type: "info",
              message: "This is a test toast",
              ttl: 3500,
            })
          }
        >
          Test Toast
        </button>

        {/* Theme Switch */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          title={`Switch theme (current: ${theme})`}
        >
          {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User */}
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {user?.email ?? "admin"}
        </span>

        {/* Logout */}
        <button
          onClick={logout}
          className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
