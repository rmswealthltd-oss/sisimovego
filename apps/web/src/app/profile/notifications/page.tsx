// apps/web/src/app/profile/notifications/page.tsx
import { apiGet } from "@/lib/serverApi";
import { ENDPOINTS } from "@/lib/config";
import { buildMeta } from "@/lib/seo";
import dynamic from "next/dynamic";

export const metadata = buildMeta({ title: "Notifications" });

const NotificationsInner = dynamic(() => import("./_NotificationsInner"), { ssr: false });

export default async function NotificationsPage() {
  // optionally fetch server subscriptions for display server-side
  const res = await apiGet(ENDPOINTS.PUSH_LIST);
  const subs = res?.subs ?? [];

  // The client inner handles subscribe/unsubscribe actions (needs PushManager)
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <div className="mt-4">
        <div className="text-sm text-gray-500">Server-side subscriptions: {subs.length}</div>
        <NotificationsInner serverSubs={subs} />
      </div>
    </div>
  );
}
