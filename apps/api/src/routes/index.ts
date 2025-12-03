import { Router } from "express";

// ----------------------
// System
// ----------------------
import authRoutes from "./auth/auth.routes";
import healthRoutes from "./system/health.routes";
import configRoutes from "./system/config.routes";

// ----------------------
// Passenger
// ----------------------
import passengerBookingRoutes from "./passengers/booking.routes";
import passengerPaymentRoutes from "./passengers/payment.routes";

// ----------------------
// Driver
// ----------------------
import driverLocationRoutes from "./drivers/location.routes";
import driverPayoutRoutes from "./drivers/payouts.routes";
import driverRoutes from "./drivers/driver.routes";

// ----------------------
// Trips
// ----------------------
import tripSearchRoutes from "./trips/tripSearch.routes";
import tripTimelineRoutes from "./trips/tripTimeline.routes";
import tripOpsRoutes from "./trips/tripOps.routes";
import tripRoutes from "./trips/trip.routes";

// ----------------------
// Refunds
// ----------------------
import refundRoutes from "./refunds/refund.routes";
import refundAdminRoutes from "./refunds/refundAdmin.routes";
import refundRuleHitsRoutes from "./refunds/refundRuleHits.route";
import refundAutoRulesRoutes from "./refunds/refundAutoRules.routes";

// ----------------------
// Payouts
// ----------------------
import payoutRoutes from "./payouts/payout.routes";
import payoutBatchRoutes from "./payouts/payoutBatch.routes";

// ----------------------
// Finance
// ----------------------
import ledgerRoutes from "./finance/ledger.routes";
import reconciliationRoutes from "./finance/reconciliation.routes";

// ----------------------
// Fraud
// ----------------------
import fraudRoutes from "./fraud/fraud.routes";
import fraudRuleRoutes from "./fraud/fraudRule.routes";
import fraudScoreRoutes from "./fraud/fraudScoreByRefund.route";
import fraudCaseRoutes from "./fraud/fraudCase.routes";
import fraudAlertsRoutes from "./fraud/fraudAlerts.routes";

// ----------------------
// Push
// ----------------------
import pushRoutes from "./push/push.routes";
import subscriptionRoutes from "./push/subscription.routes";

// ----------------------
// Admin
// ----------------------
import adminRoutes from "./admin/admin.routes";
import adminUsersRoutes from "./admin/users.routes";
import adminDriversRoutes from "./admin/drivers.routes";
import adminBookingsRoutes from "./admin/bookings.routes";
import adminNotificationsRoutes from "./admin/notifications.routes";
import adminSettingsRoutes from "./admin/settings.routes";
import adminPayoutsRoutes from "./admin/payouts.routes";
import adminDlqRoutes from "./admin/dlq.routes";
import adminOpsRoutes from "./admin/ops.routes";
import adminMapRoutes from "./admin/map.routes";
import adminAnalyticsRoutes from "./admin/analytics.routes";

// ----------------------
// Analytics
// ----------------------
import analyticsRoutes from "./analytics/analytics.routes";

const router = Router();

// -----------------------------------------------------
// System
// -----------------------------------------------------
router.use("/health", healthRoutes);
router.use("/system/config", configRoutes);

// Auth
router.use("/auth", authRoutes);

// -----------------------------------------------------
// Passenger Routes
// -----------------------------------------------------
router.use("/bookings", passengerBookingRoutes);
router.use("/payments", passengerPaymentRoutes);

// -----------------------------------------------------
// Driver Routes
// -----------------------------------------------------
router.use("/drivers/location", driverLocationRoutes);
router.use("/drivers/payouts", driverPayoutRoutes);
router.use("/drivers", driverRoutes);

// -----------------------------------------------------
// Trips Routes
// -----------------------------------------------------
router.use("/trips/search", tripSearchRoutes);
router.use("/trips/timeline", tripTimelineRoutes);
router.use("/trips/admin", tripOpsRoutes);
router.use("/trips", tripRoutes);

// -----------------------------------------------------
// Refunds
// -----------------------------------------------------
router.use("/refunds/admin", refundAdminRoutes);
router.use("/refunds/rule-hits", refundRuleHitsRoutes);
router.use("/refunds/auto-rules", refundAutoRulesRoutes);
router.use("/refunds", refundRoutes);

// -----------------------------------------------------
// Payouts
// -----------------------------------------------------
router.use("/payouts/batch", payoutBatchRoutes);
router.use("/payouts", payoutRoutes);

// -----------------------------------------------------
// Finance
// -----------------------------------------------------
router.use("/finance/ledger", ledgerRoutes);
router.use("/finance/reconciliation", reconciliationRoutes);

// -----------------------------------------------------
// Fraud
// -----------------------------------------------------
router.use("/fraud/rules", fraudRuleRoutes);
router.use("/fraud/score", fraudScoreRoutes);
router.use("/fraud/cases", fraudCaseRoutes);
router.use("/fraud/alerts", fraudAlertsRoutes);
router.use("/fraud", fraudRoutes);

// -----------------------------------------------------
// Push
// -----------------------------------------------------
router.use("/push/subscription", subscriptionRoutes);
router.use("/push", pushRoutes);

// -----------------------------------------------------
// Analytics
// -----------------------------------------------------
router.use("/analytics", analyticsRoutes);

// -----------------------------------------------------
// Admin
// -----------------------------------------------------
router.use("/admin/users", adminUsersRoutes);
router.use("/admin/drivers", adminDriversRoutes);
router.use("/admin/bookings", adminBookingsRoutes);
router.use("/admin/notifications", adminNotificationsRoutes);
router.use("/admin/settings", adminSettingsRoutes);
router.use("/admin/payouts", adminPayoutsRoutes);
router.use("/admin/dlq", adminDlqRoutes);
router.use("/admin/ops", adminOpsRoutes);
router.use("/admin/map", adminMapRoutes);
router.use("/admin/analytics", adminAnalyticsRoutes);
router.use("/admin", adminRoutes);

export default router;
