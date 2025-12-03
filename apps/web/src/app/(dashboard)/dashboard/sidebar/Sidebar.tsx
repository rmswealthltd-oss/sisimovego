"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiMapPin,
  FiPlusSquare,
  FiUser,
  FiBell,
  FiSettings,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { useUserRole } from "@/context/UserRoleContext";

interface SidebarProps {
  open: boolean; // mobile
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { role } = useUserRole();

  // Navigation items
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: FiHome },
    { name: "Search Trips", href: "/dashboard/search", icon: FiMapPin },
    { name: "Post a Trip", href: "/dashboard/post-trip", icon: FiPlusSquare, roles: ["driver", "admin"] },
    { name: "My Trips", href: "/dashboard/my-trips", icon: FiMapPin, roles: ["passenger", "driver"] },
    { name: "Profile", href: "/dashboard/profile", icon: FiUser },
    { name: "Notifications", href: "/dashboard/notifications", icon: FiBell },
    { name: "Settings", href: "/dashboard/settings", icon: FiSettings, roles: ["admin"] },
  ];

  return (
    <>
      {/* BACKDROP (mobile only) */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={clsx(
          "fixed z-50 inset-y-0 left-0 w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-orange-500">SisiMove</h1>

          {/* Close button (mobile) */}
          <button
            onClick={onClose}
            className="md:hidden text-gray-600 hover:text-orange-500"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* USER INFO */}
        <div className="px-6 py-5 border-b border-gray-200">
          <p className="text-lg font-medium text-gray-900">
            {user?.lastName || "Guest User"}
          </p>
          <p className="text-sm text-gray-500">{user?.email || "Not logged in"}</p>
          {role && (
            <span className="mt-1 inline-block text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600 capitalize">
              {role}
            </span>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems
            .filter((item) => !item.roles || item.roles.includes(role || ""))
            .map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-6 py-3 text-sm font-medium transition rounded-md",
                    active
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={onClose} // close sidebar on mobile
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
        </nav>

        {/* FOOTER / LOGOUT */}
        {user && (
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center gap-3 text-red-600 font-medium hover:text-red-800 transition"
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
