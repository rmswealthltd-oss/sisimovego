import React from "react";

// dashboard
const Dashboard = React.lazy(() => import("../pages/Dashboard"));

// trips
const TripList = React.lazy(() => import("../pages/trips/TripList"));
const TripInspector = React.lazy(() => import("../pages/trips/TripInspector"));

// drivers
const DriversList = React.lazy(() => import("../pages/drivers/DriversList"));
const DriverProfile = React.lazy(() => import("../pages/drivers/DriverProfile"));
const DriverPayouts = React.lazy(() => import("../pages/drivers/DriverPayouts"));
const DriverTrips = React.lazy(() => import("../pages/drivers/DriverTrips"));

// refunds
const RefundList = React.lazy(() => import("../pages/refunds/RefundList"));
const RefundDetails = React.lazy(() => import("../pages/refunds/RefundDetails"));

// payouts
const PayoutList = React.lazy(() => import("../pages/payouts/PayoutList"));
const PayoutBatchList = React.lazy(() => import("../pages/payouts/PayoutBatchList"));
const PayoutBatchDetails = React.lazy(() => import("../pages/payouts/PayoutBatchDetails"));
const LedgerViewer = React.lazy(() => import("../pages/payouts/LedgerViewer"));

// reconciliation
const ReconciliationDashboard = React.lazy(() => import("../pages/reconciliation/ReconciliationDashboard"));
const MpesaReconciliation = React.lazy(() => import("../pages/reconciliation/MpesaReconciliation"));
const StripeReconciliation = React.lazy(() => import("../pages/reconciliation/StripeReconciliation"));
const SettlementMismatchList = React.lazy(() => import("../pages/reconciliation/SettlementMismatchList"));

// fraud
const FraudDashboard = React.lazy(() => import("../pages/fraud/FraudDashboard"));
const FraudRuleList = React.lazy(() => import("../pages/fraud/FraudRuleList"));
const FraudRuleEditor = React.lazy(() => import("../pages/fraud/FraudRuleEditor"));
const FraudCaseList = React.lazy(() => import("../pages/fraud/FraudCaseList"));
const FraudCaseDetails = React.lazy(() => import("../pages/fraud/FraudCaseDetails"));
const FraudAlerts = React.lazy(() => import("../pages/fraud/FraudAlerts"));

// system
const DLQList = React.lazy(() => import("../pages/system/DLQList"));
const OutboxList = React.lazy(() => import("../pages/system/OutboxList"));
const Health = React.lazy(() => import("../pages/system/Health"));
const Config = React.lazy(() => import("../pages/system/Config"));

// users
const UserList = React.lazy(() => import("../pages/users/UserList"));
const UserDetails = React.lazy(() => import("../pages/users/UserDetails"));
const UserTrips = React.lazy(() => import("../pages/users/UserTrips"));

export const lazyRoutes = [
  // dashboard
  { path: "", element: <Dashboard /> },

  // TRIPS
  { path: "trips", element: <TripList /> },
  { path: "trips/:id", element: <TripInspector /> },

  // DRIVERS
  { path: "drivers", element: <DriversList /> },
  { path: "drivers/:id", element: <DriverProfile /> },
  { path: "drivers/:id/payouts", element: <DriverPayouts /> },
  { path: "drivers/:id/trips", element: <DriverTrips /> },

  // REFUNDS
  { path: "refunds", element: <RefundList /> },
  { path: "refunds/:id", element: <RefundDetails /> },

  // PAYOUTS
  { path: "payouts", element: <PayoutList /> },
  { path: "payout-batches", element: <PayoutBatchList /> },
  { path: "payout-batches/:id", element: <PayoutBatchDetails /> },
  { path: "ledger", element: <LedgerViewer /> },

  // RECONCILIATION
  { path: "reconciliation", element: <ReconciliationDashboard /> },
  { path: "reconciliation/mpesa", element: <MpesaReconciliation /> },
  { path: "reconciliation/stripe", element: <StripeReconciliation /> },
  { path: "reconciliation/settlement-mismatch", element: <SettlementMismatchList /> },

  // FRAUD
  { path: "fraud", element: <FraudDashboard /> },
  { path: "fraud/rules", element: <FraudRuleList /> },
  { path: "fraud/rules/:id", element: <FraudRuleEditor /> },
  { path: "fraud/cases", element: <FraudCaseList /> },
  { path: "fraud/cases/:id", element: <FraudCaseDetails /> },
  { path: "fraud/alerts", element: <FraudAlerts /> },

  // SYSTEM
  { path: "system/dlq", element: <DLQList /> },
  { path: "system/outbox", element: <OutboxList /> },
  { path: "system/health", element: <Health /> },
  { path: "system/config", element: <Config /> },

  // USERS
  { path: "users", element: <UserList /> },
  { path: "users/:id", element: <UserDetails /> },
  { path: "users/:id/trips", element: <UserTrips /> },
];

// 👉 export alias for compatibility
export const routes = lazyRoutes;
