// apps/web/src/app/profile/page.tsx
import { apiGet } from "@/lib/serverApi";
import { ENDPOINTS } from "@/lib/config";
import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import DriverCard from "@/components/DriverCard";

export const metadata = buildMeta({
  title: "Profile",
  description: "Manage your personal information, trips, and settings."
});

export default async function ProfilePage() {
  // Server-side fetch (auth cookies forwarded automatically)
  const res = await apiGet(ENDPOINTS.AUTH_ME);
  const user = res?.user ?? res ?? null;

  // 🔐 Not logged in → static server-rendered prompt
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">You're not signed in</h1>
        <p className="mt-2 text-gray-600">
          Please{" "}
          <Link href="/auth/login" className="text-primary underline">
            sign in
          </Link>{" "}
          to view your profile.
        </p>
      </div>
    );
  }

  // Logged in → show profile dashboard
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">My profile</h1>

      {/* USER INFO */}
      <div className="bg-white p-4 rounded shadow">
        <div className="font-medium text-lg">{user.name ?? "Unnamed User"}</div>
        {user.email && (
          <div className="text-sm text-gray-500">{user.email}</div>
        )}

        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="/profile/edit" className="text-primary underline">
            Edit Profile
          </Link>
          <Link
            href="/profile/paymentMethods"
            className="text-primary underline"
          >
            Payment Methods
          </Link>
          <Link href="/profile/trips" className="text-primary underline">
            My Trips
          </Link>
        </div>
      </div>

      {/* RECENT DRIVER */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Recent driver</h2>

        {user.lastDriver ? (
          <DriverCard driver={user.lastDriver} />
        ) : (
          <div className="text-sm text-gray-500">No recent driver</div>
        )}
      </div>
    </div>
  );
}
