// src/routes/index.ts
import { Router } from "express";

// core groups
import authRoutes from "./auth/auth.routes";
import healthRoutes from "./system/health.routes";
import configRoutes from "./system/config.routes";

// passengers
import passengerBookingRoutes from "./passengers/booking.routes";
import passengerPaymentRoutes from "./passengers/payment.routes";

// drivers
import driverRoutes from "./drivers/driver.routes";
import driverLocationRoutes from "./drivers/location.routes";
import driverPayoutRoutes from "./drivers/payouts.routes";

// trips
import tripRoutes from "./trips/trip.routes";
import tripSearchRoutes from "./trips/tripSearch.routes";
import tripTimelineRoutes from "./trips/tripTimeline.routes";
import tripOpsRoutes from "./trips/tripOps.routes";

// refunds
import refundRoutes from "./refunds/refund.routes";
import refundAdminRoutes from "./refunds/refundAdmin.routes";
import refundRuleHitsRoutes from "./refunds/refundRuleHits.route";
import refundAutoRulesRoutes from "./refunds/refundAutoRules.routes";

// payouts
import payoutRoutes from "./payouts/payout.routes";
import payoutBatchRoutes from "./payouts/payoutBatch.routes";

// finance
import ledgerRoutes from "./finance/ledger.routes";
import reconciliationRoutes from "./finance/reconciliation.routes";

// fraud
import fraudRoutes from "./fraud/fraud.routes";
import fraudRuleRoutes from "./fraud/fraudRule.routes";
import fraudScoreRoutes from "./fraud/fraudScoreByRefund.route";
import fraudCaseRoutes from "./fraud/fraudCase.routes";
import fraudAlertsRoutes from "./fraud/fraudAlerts.routes";

// push
import pushRoutes from "./push/push.routes";
import subscriptionRoutes from "./push/subscription.routes";

// admin
import adminRoutes from "./admin/admin.routes";
import adminUsersRoutes from "./admin/users.routes";
import adminDlqRoutes from "./admin/dlq.routes";
import adminOpsRoutes from "./admin/ops.routes";
import adminMapRoutes from "./admin/map.routes";
import adminAnalyticsRoutes from "./admin/analytics.routes";

// NEW admin routes that were missing
import adminBookingsRoutes from "./admin/bookings.routes";
import adminNotificationsRoutes from "./admin/notifications.routes";
import adminSettingsRoutes from "./admin/settings.routes";
import adminDriversRoutes from "./admin/drivers.routes";
import adminPayoutsRoutes from "./admin/payouts.routes"; // if exists

const router = Router();

// System
router.use("/health", healthRoutes);
router.use("/system/config", configRoutes);

// Auth
router.use("/auth", authRoutes);

// Passengers
router.use("/passengers/bookings", passengerBookingRoutes);
router.use("/passengers/payments", passengerPaymentRoutes);

// Drivers
router.use("/drivers", driverRoutes);
router.use("/drivers/location", driverLocationRoutes);
router.use("/drivers/payouts", driverPayoutRoutes);

// Trips
router.use("/trips", tripRoutes);
router.use("/trips/search", tripSearchRoutes);
router.use("/trips/timeline", tripTimelineRoutes);
router.use("/trips/admin", tripOpsRoutes);

// Refunds
router.use("/refunds", refundRoutes);
router.use("/refunds/admin", refundAdminRoutes);
router.use("/refunds/rule-hits", refundRuleHitsRoutes);
router.use("/refunds/auto-rules", refundAutoRulesRoutes);

// Payouts
router.use("/payouts", payoutRoutes);
router.use("/payouts/batch", payoutBatchRoutes);

// Finance
router.use("/finance/ledger", ledgerRoutes);
router.use("/finance/reconciliation", reconciliationRoutes);

// Fraud
router.use("/fraud", fraudRoutes);
router.use("/fraud/rules", fraudRuleRoutes);
router.use("/fraud/score", fraudScoreRoutes);
router.use("/fraud/cases", fraudCaseRoutes);
router.use("/fraud/alerts", fraudAlertsRoutes);

// Push
router.use("/push", pushRoutes);
router.use("/push/subscription", subscriptionRoutes);

// Admin (core)
router.use("/admin", adminRoutes);
router.use("/admin/users", adminUsersRoutes);
router.use("/admin/drivers", adminDriversRoutes);       // ← FIXED
router.use("/admin/bookings", adminBookingsRoutes);     // ← FIXED
router.use("/admin/notifications", adminNotificationsRoutes); // ← FIXED
router.use("/admin/settings", adminSettingsRoutes);     // ← FIXED
router.use("/admin/payouts", adminPayoutsRoutes);       // ← optional
router.use("/admin/dlq", adminDlqRoutes);
router.use("/admin/ops", adminOpsRoutes);
router.use("/admin/map", adminMapRoutes);
router.use("/admin/analytics", adminAnalyticsRoutes);

export default router;
