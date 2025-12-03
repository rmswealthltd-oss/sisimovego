"use client";

import React, { createContext, useContext, useState } from "react";

export type NotificationType = "success" | "error" | "info";

export interface Notification {
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  notification: Notification | null;
  show: (type: NotificationType, message: string) => void;
  clear: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notification: null,
  show: () => {},
  clear: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  function show(type: NotificationType, message: string) {
    setNotification({ type, message });

    // Auto-clear after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  }

  function clear() {
    setNotification(null);
  }

  return (
    <NotificationContext.Provider value={{ notification, show, clear }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
