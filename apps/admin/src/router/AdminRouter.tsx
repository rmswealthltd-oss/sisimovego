import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { routes } from "./routes";

import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login";

/* Pages */
import Dashboard from "../pages/Dashboard";

/* Trips */
import TripList from "../pages/trips/TripList";
import TripInspector from "../pages/trips/TripInspector";

/* Drivers */
import DriversList from "../pages/drivers/DriversList";
import DriverProfile from "../pages/drivers/DriverProfile";

/* Refunds */
import RefundList from "../pages/refunds/RefundList";
import RefundDetails from "../pages/refunds/RefundDetails";

/* Payouts */
import PayoutList from "../pages/payouts/PayoutList";
import PayoutBatchList from "../pages/payouts/PayoutBatchList";
import PayoutBatchDetails from "../pages/payouts/PayoutBatchDetails";
import LedgerViewer from "../pages/payouts/LedgerViewer";

/* Reconciliation */
import ReconciliationDashboard from "../pages/reconciliation/ReconciliationDashboard";
import MpesaReconciliation from "../pages/reconciliation/MpesaReconciliation";
import StripeReconciliation from "../pages/reconciliation/StripeReconciliation";
import SettlementMismatchList from "../pages/reconciliation/SettlementMismatchList";

/* Fraud */
import FraudDashboard from "../pages/fraud/FraudDashboard";
import FraudRuleList from "../pages/fraud/FraudRuleList";
import FraudCaseList from "../pages/fraud/FraudCaseList";
import FraudCaseDetails from "../pages/fraud/FraudCaseDetails";
import FraudAlerts from "../pages/fraud/FraudAlerts";

/* System */
import DLQList from "../pages/system/DLQList";
import OutboxList from "../pages/system/OutboxList";
import Health from "../pages/system/Health";
import Config from "../pages/system/Config";

/* Users */
import UserList from "../pages/users/UserList";
import UserDetails from "../pages/users/UserDetails";

export function AdminRouter() {
  return (
    <Routes>

      {/* Public login route */}
      <Route path={routes.login} element={<Login />} />

      {/* Protected admin layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Trips */}
        <Route path={routes.trips} element={<TripList />} />
        <Route path={routes.tripById()} element={<TripInspector />} />

        {/* Drivers */}
        <Route path={routes.drivers} element={<DriversList />} />
        <Route path={routes.driverById()} element={<DriverProfile />} />

        {/* Refunds */}
        <Route path={routes.refunds} element={<RefundList />} />
        <Route path={routes.refundById()} element={<RefundDetails />} />

        {/* Payouts */}
        <Route path={routes.payouts} element={<PayoutList />} />
        <Route path={routes.payoutBatches} element={<PayoutBatchList />} />
        <Route path={routes.payoutBatchById()} element={<PayoutBatchDetails />} />
        <Route path={routes.ledger} element={<LedgerViewer />} />

        {/* Reconciliation */}
        <Route path={routes.reconciliation} element={<ReconciliationDashboard />} />
        <Route path={routes.reconciliationMpesa} element={<MpesaReconciliation />} />
        <Route path={routes.reconciliationStripe} element={<StripeReconciliation />} />
        <Route path={routes.settlementMismatch} element={<SettlementMismatchList />} />

        {/* Fraud */}
        <Route path={routes.fraud} element={<FraudDashboard />} />
        <Route path={routes.fraudRules} element={<FraudRuleList />} />
        <Route path={routes.fraudCases} element={<FraudCaseList />} />
        <Route path={routes.fraudCaseById()} element={<FraudCaseDetails />} />
        <Route path={routes.fraudAlerts} element={<FraudAlerts />} />

        {/* System */}
        <Route path={routes.dlq} element={<DLQList />} />
        <Route path={routes.outbox} element={<OutboxList />} />
        <Route path={routes.health} element={<Health />} />
        <Route path={routes.config} element={<Config />} />

        {/* Users */}
        <Route path={routes.users} element={<UserList />} />
        <Route path={routes.userById()} element={<UserDetails />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
