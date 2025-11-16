// apps/web/src/app/profile/edit/page.tsx
import { apiGet } from "@/lib/serverApi";
import { ENDPOINTS } from "@/lib/config";
import dynamic from "next/dynamic";
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "Edit profile" });

// client edit component is dynamically imported
const EditInner = dynamic(() => import("./_EditInner"), { ssr: false });

export default async function EditProfilePage() {
  const res = await apiGet(ENDPOINTS.AUTH_ME);
  const user = res?.user ?? res ?? null;

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600">Please sign in to edit your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Edit Profile</h1>
      <EditInner serverUser={user} />
    </div>
  );
}
