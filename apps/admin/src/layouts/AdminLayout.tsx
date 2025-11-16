import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import MobileAdminNav from "./MobileAdminNav";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64">
        <AdminSidebar />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileAdminNav />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <AdminTopBar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
