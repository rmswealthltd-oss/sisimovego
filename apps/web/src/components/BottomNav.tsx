"use client";

import Link from "next/link";
import { Home, Search, Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/results", icon: Search, label: "Search" },
    { href: "/notifications", icon: Bell, label: "Alerts" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="bg-white border-t shadow-lg p-2 flex justify-around">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center text-xs"
          >
            <Icon
              size={22}
              className={active ? "text-[var(--color-primary)]" : "text-gray-500"}
            />
            <span
              className={
                active ? "text-[var(--color-primary)] font-medium" : "text-gray-500"
              }
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
