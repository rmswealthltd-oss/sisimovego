import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  User,
  Car,
  Route,
  Ticket,
  Wallet,
  Bell,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";

const menu = [
  { label: "Dashboard", to: "/admin", icon: Home },
  { label: "Users", to: "/admin/users", icon: User },
  { label: "Drivers", to: "/admin/drivers", icon: Car },
  { label: "Trips", to: "/admin/trips", icon: Route },
  { label: "Bookings", to: "/admin/bookings", icon: Ticket },
  { label: "Payouts", to: "/admin/payouts", icon: Wallet },
  { label: "Notifications", to: "/admin/notifications", icon: Bell },
  { label: "Fraud Engine", to: "/admin/fraud", icon: ShieldCheck },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col justify-between">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">SisiMove Admin</h1>

        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t dark:border-gray-700">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-100 text-red-600 dark:hover:bg-red-900 dark:text-red-400 w-full">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
