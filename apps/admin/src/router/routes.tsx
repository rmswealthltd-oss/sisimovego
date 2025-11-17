import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

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

// Settings
import Settings from "../pages/settings/Settings";

const router = createBrowserRouter([
  // -----------------------------
  // PUBLIC ROUTES
  // -----------------------------
  { path: "/login", element: <Login /> },

  // -----------------------------
  // ADMIN ROUTES
  // -----------------------------
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

      // Settings
      { path: "settings", element: <Settings /> },
    ],
  },

  // -----------------------------
  // FALLBACK
  // -----------------------------
  {
    path: "*",
    element: (
      <div className="p-6 text-center text-2xl font-semibold">
        404 — Page Not Found
      </div>
    ),
  },
]);

// Export wrapper so main.tsx can use <AdminRouter />
export function AdminRouter() {
  return <RouterProvider router={router} />;
}
