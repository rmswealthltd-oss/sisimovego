"use client";

import Link from "next/link";
import { Home, Search, User, Book } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const path = usePathname();

  const active = (href: string) => {
    if (href === "/") return path === "/";
    return path.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm md:hidden z-40">
      <div className="flex justify-around items-center py-2">
        <Link
          href="/"
          className={`flex flex-col items-center ${active("/") ? "text-primary" : "text-gray-500"}`}
        >
          <Home size={22} />
          <span className="text-[10px]">Home</span>
        </Link>

        <Link
          href="/search"
          className={`flex flex-col items-center ${active("/search") ? "text-primary" : "text-gray-500"}`}
        >
          <Search size={22} />
          <span className="text-[10px]">Search</span>
        </Link>

        <Link
          href="/bookings"
          className={`flex flex-col items-center ${active("/bookings") ? "text-primary" : "text-gray-500"}`}
        >
          <Book size={22} />
          <span className="text-[10px]">Bookings</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center ${active("/profile") ? "text-primary" : "text-gray-500"}`}
        >
          <User size={22} />
          <span className="text-[10px]">Profile</span>
        </Link>
      </div>
    </div>
  );
}
