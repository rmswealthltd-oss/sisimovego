"use client";

import { useAuthContext } from "../../context/AuthContext";
import Link from "next/link";

export default function ProfileInner() {
  const { user, logout } = useAuthContext();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="bg-white shadow rounded p-4 space-y-3">
        <div className="text-lg font-medium">{user.name}</div>
        <div className="text-sm text-gray-500">{user.email}</div>

        <div className="pt-4 border-t flex flex-col gap-2">
          <Link href="/profile/edit" className="text-primary underline">
            Edit profile
          </Link>
          <Link href="/profile/paymentMethods" className="text-primary underline">
            Payment methods
          </Link>
          <Link href="/profile/notifications" className="text-primary underline">
            Notifications
          </Link>
        </div>

        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
