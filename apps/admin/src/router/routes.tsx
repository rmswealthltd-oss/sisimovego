// src/routes/routes.tsx

import React from "react";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

// Pages
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

// Trips
import TripList from "../pages/trips/TripList";
import TripInspector from "../pages/trips/TripInspector";

// Drivers
import DriversList from "../pages/drivers/DriversList";
import DriverProfile from "../pages/drivers/DriverProfile";

// Refunds
import RefundList from "../pages/refunds/RefundList";
import RefundDetails from "../pages/refunds/RefundDetails";

// Payouts
import PayoutList from "../pages/payouts/PayoutList";
import PayoutBatchList from "../pages/payouts/PayoutBatchList";
import PayoutBatchDetails from "../pages/payouts/PayoutBatchDetails";

// Reconciliation
import ReconciliationDashboard from "../pages/reconciliation/ReconciliationDashboard";

// Fraud
import FraudDashboard from "../pages/fraud/FraudDashboard";
import FraudRuleList from "../pages/fraud/FraudRuleList";
import FraudRuleEditor from "../pages/fraud/FraudRuleEditor";
import FraudCaseList from "../pages/fraud/FraudCaseList";
import FraudCaseDetails from "../pages/fraud/FraudCaseDetails";

// System
import DLQList from "../pages/system/DLQList";
import OutboxList from "../pages/system/OutboxList";
import Health from "../pages/system/Health";
import Config from "../pages/system/Config";

// Users
import UserList from "../pages/users/UserList";
import UserDetails from "../pages/users/UserDetails";
import UserTrips from "../pages/users/UserTrips";

// Bookings
import BookingList from "../pages/bookings/BookingList";
import BookingDetails from "../pages/bookings/BookingDetails";

// Notifications
import NotificationList from "../pages/notifications/NotificationList";
import SendNotification from "../pages/notifications/SendNotification";

// ---------------------------------------------------------
// SETTINGS (Correct folder path: apps/admin/src/pages/settings/)
// ---------------------------------------------------------
import SettingsPage from "../pages/settings/SettingsPage";
import GeneralSettings from "../pages/settings/components/GeneralSettings";
import LocationSettings from "../pages/settings/components/LocationSettings";
import PriceSettings from "../pages/settings/components/PriceSettings";
import PlatformFeeSettings from "../pages/settings/components/PlatformFeeSettings";
import VerificationSettings from "../pages/settings/components/VerificationSettings";
import AdminAccountSettings from "../pages/settings/components/AdminAccountSettings";

// ---------------------------------------------------------
// ROUTER
// ---------------------------------------------------------
export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },

      // Trips
      { path: "trips", element: <TripList /> },
      { path: "trips/:id", element: <TripInspector /> },

      // Drivers
      { path: "drivers", element: <DriversList /> },
      { path: "drivers/:id", element: <DriverProfile /> },

      // Refunds
      { path: "refunds", element: <RefundList /> },
      { path: "refunds/:id", element: <RefundDetails /> },

      // Payouts
      { path: "payouts", element: <PayoutList /> },
      { path: "payouts/batches", element: <PayoutBatchList /> },
      { path: "payouts/batches/:batchId", element: <PayoutBatchDetails /> },

      // Reconciliation
      { path: "reconciliation", element: <ReconciliationDashboard /> },

      // Fraud
      { path: "fraud", element: <FraudDashboard /> },
      { path: "fraud/rules", element: <FraudRuleList /> },
      { path: "fraud/rules/:id", element: <FraudRuleEditor /> },
      { path: "fraud/cases", element: <FraudCaseList /> },
      { path: "fraud/cases/:id", element: <FraudCaseDetails /> },

      // System
      { path: "system/dlq", element: <DLQList /> },
      { path: "system/outbox", element: <OutboxList /> },
      { path: "system/health", element: <Health /> },
      { path: "system/config", element: <Config /> },

      // Users
      { path: "users", element: <UserList /> },
      { path: "users/:id", element: <UserDetails /> },
      { path: "users/:id/trips", element: <UserTrips /> },

      // Bookings
      { path: "bookings", element: <BookingList /> },
      { path: "bookings/:id", element: <BookingDetails /> },

      // Notifications
      { path: "notifications", element: <NotificationList /> },
      { path: "notifications/send", element: <SendNotification /> },

      // ---------------------------------------------------------
      // SETTINGS (FULLY FIXED & WORKING)
      // ---------------------------------------------------------
      {
        path: "settings",
        element: <SettingsPage />, // <Outlet /> inside will render children
        children: [
          { index: true, element: <GeneralSettings /> },
          { path: "general", element: <GeneralSettings /> },
          { path: "locations", element: <LocationSettings /> },
          { path: "pricing", element: <PriceSettings /> },
          { path: "fees", element: <PlatformFeeSettings /> },
          { path: "verification", element: <VerificationSettings /> },
          { path: "account", element: <AdminAccountSettings /> },
        ],
      },
    ],
  },

  {
    path: "*",
    element: (
      <div className="p-6 text-center text-2xl font-semibold">
        404 — Page Not Found
      </div>
    ),
  },
]);

export function AdminRouter() {
  return <RouterProvider router={router} />;
}
