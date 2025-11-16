// apps/web/src/app/profile/notifications/_NotificationsInner.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Api } from "../../../lib/api";
import { getSubscription, subscribeUser, unsubscribeUser } from "../../../lib/pushClient";

export default function NotificationsInner() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSub, setLocalSub] = useState<PushSubscription | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [remoteRes, local] = await Promise.all([
        Api.getSubscriptions().catch(() => ({ subs: [] })),
        getSubscription().catch(() => null)
      ]);
      setSubs(remoteRes?.subs ?? []);
      setLocalSub(local as any);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubscribe() {
    try {
      const s = await subscribeUser();
      setLocalSub(s as any);
      await load();
    } catch (e) {
      alert((e as any)?.message || "Subscribe failed");
    }
  }

  async function handleUnsubscribe(endpoint?: string) {
    try {
      if (!endpoint) {
        await unsubscribeUser();
      } else {
        await Api.deleteSubscription(endpoint);
      }
      await load();
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold">Notifications</h2>

      <div className="bg-white p-4 rounded shadow mt-4 space-y-4">
        <div>
          <div className="text-sm text-gray-500">Browser subscription</div>
          <div className="mt-2">
            {localSub ? (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">{localSub.endpoint}</div>
                <button onClick={() => handleUnsubscribe(localSub.endpoint)} className="px-3 py-1 rounded border text-sm">Unsubscribe</button>
              </div>
            ) : (
              <div>
                <div className="text-sm text-gray-500">Not subscribed</div>
                <button onClick={handleSubscribe} className="mt-2 px-3 py-1 bg-primary text-white rounded">Enable push</button>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Server subscriptions</div>
          <div className="mt-2 space-y-2">
            {loading ? <div className="text-sm text-gray-500">Loading…</div> : (
              subs.length ? subs.map((s: any) => (
                <div key={s.id ?? s.endpoint} className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">{s.endpoint?.slice(0,60) ?? s.id}</div>
                  <button onClick={() => handleUnsubscribe(s.endpoint ?? s.id)} className="px-3 py-1 rounded border text-sm">Delete</button>
                </div>
              )) : <div className="text-sm text-gray-500">No server subscriptions</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
