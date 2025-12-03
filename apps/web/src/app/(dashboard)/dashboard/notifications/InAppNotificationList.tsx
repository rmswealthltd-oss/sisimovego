"use client";

import { useEffect, useState } from "react";

interface Notification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function InAppNotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = async () => {
    const res = await fetch("/api/notifications/list");
    const data = await res.json();
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (notifications.length === 0)
    return <p className="text-gray-500">No notifications yet.</p>;

  return (
    <ul className="space-y-4">
      {notifications.map((n) => (
        <li key={n.id} className="border rounded-xl p-4 bg-white">
          <p className="font-semibold text-gray-800">{n.title}</p>
          <p className="text-gray-600 text-sm">{n.body}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(n.createdAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
