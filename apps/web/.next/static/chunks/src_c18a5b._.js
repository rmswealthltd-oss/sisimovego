(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_c18a5b._.js", {

"[project]/apps/web/src/components/HeroSearch.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>HeroSearch
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@14.1.0_@babel+core@7.28.5_react-dom@18.3.0_react@18.3.0__react@18.3.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@14.1.0_@babel+core@7.28.5_react-dom@18.3.0_react@18.3.0__react@18.3.0/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@14.1.0_@babel+core@7.28.5_react-dom@18.3.0_react@18.3.0__react@18.3.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
function HeroSearch() {
    _s();
    const router = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]();
    // Native, stable date (no date-fns)
    const today = new Date().toISOString().split("T")[0];
    const [origin, setOrigin] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]("");
    const [destination, setDestination] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]("");
    const [date, setDate] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](today);
    function submit(e) {
        e?.preventDefault();
        if (!origin.trim() || !destination.trim()) return;
        const q = new URLSearchParams();
        q.set("origin", origin.trim());
        q.set("destination", destination.trim());
        q.set("date", date);
        router.push(`/results?${q.toString()}`);
    }
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"]("section", {
        className: "bg-white border rounded-xl p-6 shadow-sm space-y-4",
        children: [
            /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"]("div", {
                children: [
                    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"]("h2", {
                        className: "text-xl font-semibold",
                        children: "Find your next trip"
                    }, void 0, false, {
                        fileName: "<[project]/apps/web/src/components/HeroSearch.tsx>",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"]("p", {
                        className: "text-sm text-gray-600",
                        children: "Enter your route and travel date to get started."
                    }, void 0, false, {
                        fileName: "<[project]/apps/web/src/components/HeroSearch.tsx>",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "<[project]/apps/web/src/components/HeroSearch.tsx>",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"]("form", {
                onSubmit: submit,
                className: "grid grid-cols-1 md:grid-cols-4 gap-3",
                children: [
                    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"]("input", {
                        value: origin,
                        onChange: (e)=>setOrigin(e.target.value),
                        placeholder: "Origin (city, landmark)",
                        className: "border p-3 rounded-lg text-sm w-full"
                    }, void 0, false, {
                        fileName: "<[project]/apps/web/src/components/HeroSearch.tsx>",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"]("input", {
                        value: destination,
                        onChange: (e)=>setDestination(e.target.value),
                        placeholder: "Destination",
                        className: "border p-3 rounded-lg text-sm w-full"
                    }, void 0, false, {
                        fileName: "<[project]/apps/web/src/components/HeroSearch.tsx>",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"]("input", {
                        type: "date",
                        value: date,
                        min: today,
                        onChange: (e)=>setDate(e.target.value),
                        className: "border p-3 rounded-lg text-sm w-full"
                    }, void 0, false, {
                        fileName: "<[project]/apps/web/src/components/HeroSearch.tsx>",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"]("button", {
                        type: "submit",
                        className: "bg-primary text-white px-4 py-3 rounded-lg w-full font-medium",
                        children: "Search trips"
                    }, void 0, false, {
                        fileName: "<[project]/apps/web/src/components/HeroSearch.tsx>",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "<[project]/apps/web/src/components/HeroSearch.tsx>",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "<[project]/apps/web/src/components/HeroSearch.tsx>",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_s(HeroSearch, "FOf274vv/OtIj9CEEWFvpuRYToY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = HeroSearch;
var _c;
__turbopack_refresh__.register(_c, "HeroSearch");

})()),
"[project]/apps/web/src/app/search/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=src_c18a5b._.js.map