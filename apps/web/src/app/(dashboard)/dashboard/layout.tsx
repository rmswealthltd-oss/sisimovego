"use client";

import { ReactNode, useState, useCallback } from "react";
import clsx from "clsx";
import Sidebar from "./sidebar/Sidebar";
import Header from "@/components/dashboard/Header";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { UserRoleProvider } from "@/context/UserRoleContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <AuthProvider>
      <UserRoleProvider>
        <NotificationProvider>
          <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={closeSidebar} />

            {/* Main content area */}
            <div
              className={clsx(
                "flex flex-col flex-1 transition-all duration-200",
                sidebarOpen ? "md:ml-64" : "md:ml-0"
              )}
            >
              {/* Header */}
              <Header onOpenSidebar={openSidebar} />

              {/* Page content */}
              <main className="p-6 w-full max-w-7xl mx-auto">{children}</main>
            </div>
          </div>
        </NotificationProvider>
      </UserRoleProvider>
    </AuthProvider>
  );
}
