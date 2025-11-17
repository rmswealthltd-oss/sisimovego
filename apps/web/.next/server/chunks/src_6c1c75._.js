module.exports = {

"[project]/apps/web/src/lib/money.ts [app-ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

/**
 * money.ts
 * ----------
 * Lightweight currency formatter for the SisimoveGo frontend.
 * Supports:
 *   - KES (default)
 *   - USD
 *   - NGN
 *   - ZAR
 *   - UGX
 *   - TZS
 *
 * Automatically handles:
 *   - rounding
 *   - localization
 *   - fallback for server-side rendering
 */ __turbopack_esm__({
    "money": ()=>money,
    "moneyFromCents": ()=>moneyFromCents,
    "parseMoney": ()=>parseMoney
});
const DEFAULT_CURRENCY = "KES";
function money(amount, currency = DEFAULT_CURRENCY) {
    if (amount === null || amount === undefined) return "—";
    const value = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(value)) return "—";
    try {
        return new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency,
            minimumFractionDigits: 0
        }).format(value);
    } catch (err) {
        // Fallback for unsupported currencies or SSR
        return `${currency} ${value.toFixed(0)}`;
    }
}
function moneyFromCents(cents, currency = DEFAULT_CURRENCY) {
    return money(cents / 100, currency);
}
function parseMoney(str) {
    if (!str) return 0;
    // Remove commas, spaces, currency symbols
    const cleaned = str.replace(/[^\d.-]/g, "");
    return parseFloat(cleaned) || 0;
}

})()),
"[project]/apps/web/src/constants/tripStatus.ts [app-ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

// apps/web/src/constants/tripStatus.ts
__turbopack_esm__({
    "TripStatus": ()=>TripStatus,
    "TripStatusColors": ()=>TripStatusColors,
    "TripStatusLabels": ()=>TripStatusLabels
});
const TripStatus = {
    PENDING: "PENDING",
    ASSIGNED: "ASSIGNED",
    STARTED: "STARTED",
    ARRIVED: "ARRIVED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED"
};
const TripStatusLabels = {
    PENDING: "Pending",
    ASSIGNED: "Driver Assigned",
    STARTED: "On the way",
    ARRIVED: "Arrived",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled"
};
const TripStatusColors = {
    PENDING: "gray",
    ASSIGNED: "blue",
    STARTED: "green",
    ARRIVED: "orange",
    COMPLETED: "primary",
    CANCELLED: "red"
};

})()),
"[project]/apps/web/src/utils/trip.ts [app-ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

// apps/web/src/utils/trip.ts
__turbopack_esm__({
    "formatDate": ()=>formatDate,
    "isSeatAvailable": ()=>isSeatAvailable,
    "isTripActive": ()=>isTripActive,
    "isTripCompleted": ()=>isTripCompleted,
    "safeDate": ()=>safeDate,
    "seatsAvailable": ()=>seatsAvailable,
    "tripFare": ()=>tripFare,
    "tripRouteLabel": ()=>tripRouteLabel,
    "tripShortTime": ()=>tripShortTime,
    "tripStatusColor": ()=>tripStatusColor,
    "tripStatusLabel": ()=>tripStatusLabel,
    "tripTime": ()=>tripTime
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$3$2e$6$2e$0$2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$7b$locals$7d$__ = __turbopack_import__("[project]/node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/format.mjs [app-ssr] (ecmascript) {locals}");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$constants$2f$tripStatus$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/apps/web/src/constants/tripStatus.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$money$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/apps/web/src/lib/money.ts [app-ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
function safeDate(input) {
    if (!input) return null;
    try {
        const d = new Date(input);
        if (isNaN(d.getTime())) return null;
        return d;
    } catch  {
        return null;
    }
}
function formatDate(input, pattern, fallback = "—") {
    const d = safeDate(input);
    if (!d) return fallback;
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$3$2e$6$2e$0$2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$7b$locals$7d$__["format"](d, pattern);
    } catch  {
        return fallback;
    }
}
function tripShortTime(input) {
    return formatDate(input, "HH:mm", "—");
}
function tripTime(input) {
    return formatDate(input, "dd MMM yyyy, HH:mm", "—");
}
function tripRouteLabel(origin, destination) {
    const o = origin?.trim() || "Unknown";
    const d = destination?.trim() || "Unknown";
    return `${o} → ${d}`;
}
function tripFare(cents) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$money$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["moneyFromCents"](cents);
}
function tripStatusLabel(status) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$constants$2f$tripStatus$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TripStatusLabels"][status] || "Unknown";
}
function tripStatusColor(status) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$constants$2f$tripStatus$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TripStatusColors"][status] || "gray";
}
function isTripCompleted(status) {
    return status === "COMPLETED";
}
function isTripActive(status) {
    return status === "DRIVER_ASSIGNED" || status === "ONGOING";
}
function seatsAvailable(total, booked) {
    return Math.max(0, total - booked);
}
function isSeatAvailable(total, booked) {
    return seatsAvailable(total, booked) > 0;
}

})()),
"[project]/apps/web/src/components/TripCard.tsx [app-ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

// apps/web/components/TripCard.tsx
__turbopack_esm__({
    "default": ()=>TripCard
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@14.1.0_@babel+core@7.28.5_react-dom@18.3.0_react@18.3.0__react@18.3.0/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@14.1.0_@babel+core@7.28.5_react-dom@18.3.0_react@18.3.0__react@18.3.0/node_modules/next/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$money$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/apps/web/src/lib/money.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$heroicons$2b$react$40$2$2e$2$2e$0_react$40$18$2e$3$2e$0$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$solid$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$7b$export__default__as__ClockIcon$7d$__ = __turbopack_import__("[project]/node_modules/.pnpm/@heroicons+react@2.2.0_react@18.3.0/node_modules/@heroicons/react/24/solid/esm/ClockIcon.js [app-ssr] (ecmascript) {export default as ClockIcon}");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$heroicons$2b$react$40$2$2e$2$2e$0_react$40$18$2e$3$2e$0$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$solid$2f$esm$2f$UserIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$7b$export__default__as__UserIcon$7d$__ = __turbopack_import__("[project]/node_modules/.pnpm/@heroicons+react@2.2.0_react@18.3.0/node_modules/@heroicons/react/24/solid/esm/UserIcon.js [app-ssr] (ecmascript) {export default as UserIcon}");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$trip$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/apps/web/src/utils/trip.ts [app-ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
"use client";
;
;
;
;
;
function TripCard({ trip }) {
    // Dev-only debug to validate date data
    if ("TURBOPACK compile-time truthy", 1) {
        // eslint-disable-next-line no-console
        console.log("TripCard date check:", {
            id: trip.id,
            departureAt: trip.departureAt,
            arrivalAt: trip.arrivalAt,
            parsedDeparture: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$trip$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.tripShortTime(trip.departureAt),
            parsedArrival: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$trip$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.tripShortTime(trip.arrivalAt)
        });
    }
    const departure = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$trip$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.tripShortTime(trip.departureAt);
    const arrival = trip.arrivalAt ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$trip$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.tripShortTime(trip.arrivalAt) : null;
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: `/trip/${trip.id}`,
        className: "block bg-white dark:bg-gray-900 rounded-xl shadow p-4 border dark:border-gray-700 hover:shadow-lg transition",
        children: [
            /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                className: "text-xl font-semibold mb-1",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$trip$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.tripRouteLabel(trip.origin, trip.destination)
            }, void 0, false, {
                fileName: "<[project]/apps/web/src/components/TripCard.tsx>",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                className: "flex items-center text-gray-600 dark:text-gray-300 gap-2",
                children: [
                    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$heroicons$2b$react$40$2$2e$2$2e$0_react$40$18$2e$3$2e$0$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$solid$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$7b$export__default__as__ClockIcon$7d$__["ClockIcon"], {
                        className: "w-4 h-4"
                    }, void 0, false, {
                        fileName: "<[project]/apps/web/src/components/TripCard.tsx>",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"]("span", {
                        children: [
                            departure,
                            arrival && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    " → ",
                                    arrival
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "<[project]/apps/web/src/components/TripCard.tsx>",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "<[project]/apps/web/src/components/TripCard.tsx>",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                className: "flex items-center text-gray-600 dark:text-gray-300 gap-2 mt-1",
                children: [
                    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$heroicons$2b$react$40$2$2e$2$2e$0_react$40$18$2e$3$2e$0$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$solid$2f$esm$2f$UserIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$7b$export__default__as__UserIcon$7d$__["UserIcon"], {
                        className: "w-4 h-4"
                    }, void 0, false, {
                        fileName: "<[project]/apps/web/src/components/TripCard.tsx>",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"]("span", {
                        children: trip.driverName || "Driver"
                    }, void 0, false, {
                        fileName: "<[project]/apps/web/src/components/TripCard.tsx>",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "<[project]/apps/web/src/components/TripCard.tsx>",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                className: "mt-4 text-lg font-bold text-blue-600 dark:text-blue-400",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$money$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["moneyFromCents"](trip.priceCents)
            }, void 0, false, {
                fileName: "<[project]/apps/web/src/components/TripCard.tsx>",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "<[project]/apps/web/src/components/TripCard.tsx>",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}

})()),
"[project]/apps/web/src/app/results/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),

};

//# sourceMappingURL=src_6c1c75._.js.map