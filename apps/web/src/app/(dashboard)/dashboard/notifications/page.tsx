"use client";

import NotificationSettingsForm from "./NotificationSettingsForm";
import InAppNotificationList from "./InAppNotificationList";
import PushSubscriptionToggle from "./PushSubscriptionToggle";

export default function NotificationsPage() {
  return (
    <div className="max-w-3xl space-y-12">
      <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>

      {/* Settings */}
      <section className="card space-y-6">
        <h2 className="text-xl font-semibold">Notification Preferences</h2>
        <NotificationSettingsForm />
      </section>

      {/* Push Toggle */}
      <section className="card space-y-6">
        <h2 className="text-xl font-semibold">Web Push</h2>
        <PushSubscriptionToggle />
      </section>

      {/* Recent Notifications */}
      <section className="card space-y-6">
        <h2 className="text-xl font-semibold">Recent In-App Messages</h2>
        <InAppNotificationList />
      </section>
    </div>
  );
}
