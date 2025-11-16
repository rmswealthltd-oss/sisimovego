"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const path = usePathname();

  const linkClass = (href: string) =>
    `text-sm transition ${
      path?.startsWith(href)
        ? "text-primary font-semibold"
        : "text-gray-600 hover:text-primary"
    }`;

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="text-xl font-bold text-primary">
          SisiMove
        </Link>

        {/* NAV LINKS (desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/search" className={linkClass("/search")}>
            Search
          </Link>

          <Link href="/results" className={linkClass("/results")}>
            Results
          </Link>

          {user && (
            <Link href="/bookings" className={linkClass("/bookings")}>
              My Bookings
            </Link>
          )}

          <Link href="/support" className={linkClass("/support")}>
            Support
          </Link>
        </div>

        {/* RIGHT SIDE (auth) */}
        <div className="flex items-center gap-3">

          {user ? (
            <>
              <span className="hidden sm:block text-sm text-gray-600">
                {user.name ?? user.email}
              </span>

              <button
                onClick={logout}
                className="px-3 py-1 rounded bg-red-500 text-white text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="px-3 py-1 rounded bg-primary text-white text-sm"
            >
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}
