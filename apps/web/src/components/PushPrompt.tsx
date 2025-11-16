// apps/web/src/components/PushPrompt.tsx
"use client";

import React, { useEffect, useState } from "react";
import { subscribeUser, getSubscription, unsubscribeUser } from "../lib/pushClient";

export default function PushPrompt() {
  const [supported, setSupported] = useState(false);
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sub, setSub] = useState<PushSubscription | null>(null);

  useEffect(() => {
    setSupported("serviceWorker" in navigator && "PushManager" in window && "Notification" in window);
    (async () => {
      try {
        const s = await getSubscription();
        setSub(s);
        setGranted(Notification.permission === "granted" && !!s);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  async function enable() {
    setLoading(true);
    try {
      const s = await subscribeUser();
      setSub(s as any);
      setGranted(true);
    } catch (err: any) {
      console.error("subscribe failed", err);
      if (err?.message) alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function disable() {
    setLoading(true);
    try {
      await unsubscribeUser();
      setSub(null);
      setGranted(false);
    } catch (err) {
      console.error("unsubscribe failed", err);
    } finally {
      setLoading(false);
    }
  }

  if (!supported) return null;
  if (granted) {
    return (
      <div className="fixed bottom-6 left-4 z-40">
        <div className="bg-white p-2 rounded shadow flex gap-2 items-center">
          <div className="text-sm">Notifications enabled</div>
          <button onClick={disable} disabled={loading} className="ml-2 px-2 py-1 text-sm rounded border">Disable</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-4 z-40">
      <div className="bg-white p-3 rounded shadow flex gap-3 items-center">
        <div className="text-sm">Enable push notifications to get driver arrival alerts</div>
        <button onClick={enable} disabled={loading} className="ml-4 bg-primary text-white px-3 py-1 rounded">Enable</button>
      </div>
    </div>
  );
}
