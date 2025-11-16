(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/middleware_ts_3b9c66._.js", {

"[project]/apps/web/middleware.ts [middleware] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, p: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, k: __turbopack_refresh__ }) => (() => {
"use strict";

// apps/web/middleware.ts
__turbopack_esm__({
    "config": ()=>config,
    "middleware": ()=>middleware
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$next$2d$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$7b$module__evaluation$7d$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@14.1.0_@babel+core@7.28.5_react-dom@18.3.0_react@18.3.0__react@18.3.0/node_modules/next/dist/esm/server/web/exports/next-response.js [middleware] (ecmascript) {module evaluation}");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$7b$export__NextResponse__as__default$7d$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@14.1.0_@babel+core@7.28.5_react-dom@18.3.0_react@18.3.0__react@18.3.0/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware] (ecmascript) {export NextResponse as default}");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const PUBLIC_PATHS = [
    "/",
    "/auth/login",
    "/auth/register",
    "/_next",
    "/static",
    "/favicon.ico",
    "/manifest.webmanifest",
    "/sw.js",
    "/offline.html",
    "/public",
    "/api"
];
/** Helper to check if request path is public */ function isPublicPath(pathname) {
    return PUBLIC_PATHS.some((p)=>pathname === p || pathname.startsWith(p));
}
function middleware(req) {
    const { pathname } = req.nextUrl;
    // allow public assets and API endpoints
    if (isPublicPath(pathname)) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$7b$export__NextResponse__as__default$7d$__["default"].next();
    // allow next internal routes (/_next, etc)
    if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$7b$export__NextResponse__as__default$7d$__["default"].next();
    }
    // Check for auth cookie (server-side)
    const token = req.cookies.get("sisimove_token") ?? req.cookies.get("sisimove_token_v2");
    if (!token) {
        // Not authenticated -> redirect to login with original path preserved
        const loginUrl = new URL("/auth/login", req.nextUrl.origin);
        loginUrl.searchParams.set("redirectTo", req.nextUrl.pathname + (req.nextUrl.search ?? ""));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$7b$export__NextResponse__as__default$7d$__["default"].redirect(loginUrl);
    }
    // Token exists -> allow through (server will still validate on API calls)
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$14$2e$1$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$0_react$40$18$2e$3$2e$0_$5f$react$40$18$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$7b$export__NextResponse__as__default$7d$__["default"].next();
}
const config = {
    matcher: [
        /*
      Protect all routes except:
      - root (/) and /auth/*
      - static files and next internals
    */ "/((?!auth|_next|api|static|favicon.ico|manifest.webmanifest|sw.js|offline.html).*)"
    ]
};

})()),
}]);

//# sourceMappingURL=middleware_ts_3b9c66._.js.map