"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  // Prevent hydration mismatch
  if (loading) {
    return <header className="w-full bg-white border-b sticky top-0 z-50 h-16"></header>;
  }

  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">
      <div className="max-w-[1350px] mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
            SM
          </div>
          <div className="font-extrabold text-lg text-gray-900 leading-none">
            <span>Sisi</span>
            <span className="text-orange-500">Move</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/Trips" className="text-gray-700 hover:text-blue-600">Rides</Link>
          <Link href="/drivers" className="text-gray-700 hover:text-blue-600">Drivers</Link>
          <Link href="/support" className="text-gray-700 hover:text-blue-600">Support</Link>

          <Link href="/join-trip" className="text-sm text-gray-800 hover:text-blue-700">
            Join a Trip
          </Link>

          <Link
            href="/post-trip"
            className="px-3 py-2 bg-orange-600 rounded-xl text-white font-semibold hover:bg-orange-700"
          >
            Post a Trip
          </Link>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {!user && (
            <>
              <Link
                href="/auth/login"
                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Log in
              </Link>

              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50"
            >
              <FiUser />
              <span>{user?.lastName ?? "Account"}</span>
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="px-4 py-4 space-y-3">
            <Link href="/rides" className="block text-gray-800">Rides</Link>
            <Link href="/drivers" className="block text-gray-800">Drivers</Link>
            <Link href="/support" className="block text-gray-800">Support</Link>
            <Link href="/join-trip" className="block font-medium text-blue-600">Join a Trip</Link>
            <Link href="/post-trip" className="block font-medium text-orange-600">Post a Trip</Link>

            <div className="border-t pt-3">
              {!user && (
                <>
                  <Link href="/auth/login" className="block py-2 text-blue-600">
                    Log in
                  </Link>
                  <Link href="/auth/register" className="block py-2 text-orange-600">
                    Register
                  </Link>
                </>
              )}

              {user && (
                <>
                  <Link href="/profile" className="block py-2">Profile</Link>
                  <button
                    onClick={logout}
                    className="block py-2 text-red-600 w-full text-left"
                  >
                    Log out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
