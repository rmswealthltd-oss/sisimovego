"use client";

import { useState, useEffect } from "react";

export default function PushSubscriptionToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check subscription status
  useEffect(() => {
    async function check() {
      const res = await fetch("/api/push/status");
      const data = await res.json();
      setEnabled(data.enabled);
      setLoading(false);
    }
    check();
  }, []);

  const subscribe = async () => {
    setLoading(true);

    const registration = await navigator.serviceWorker?.ready;
    const res = await fetch("/api/push/public-key");
    const { publicKey } = await res.json();

    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: Uint8Array.from(atob(publicKey), (c) =>
        c.charCodeAt(0)
      ),
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      body: JSON.stringify(sub),
    });

    setEnabled(true);
    setLoading(false);
  };

  const unsubscribe = async () => {
    setLoading(true);
    const registration = await navigator.serviceWorker?.ready;
    const sub = await registration.pushManager.getSubscription();

    if (sub) {
      await sub.unsubscribe();
      await fetch("/api/push/unsubscribe", { method: "POST" });
    }

    setEnabled(false);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Enable push notifications for urgent trip updates.
      </p>

      <button
        onClick={enabled ? unsubscribe : subscribe}
        disabled={loading}
        className={`px-5 py-2 rounded-xl text-white ${
          enabled ? "bg-secondary" : "bg-primary"
        } disabled:opacity-50`}
      >
        {loading
          ? "Processing..."
          : enabled
          ? "Disable Push Notifications"
          : "Enable Push Notifications"}
      </button>
    </div>
  );
}
