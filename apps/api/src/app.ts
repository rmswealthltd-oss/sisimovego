import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import createError from "http-errors";

import { env } from "./env";
import router from "./routes";
import { rateLimit } from "./middleware/rateLimit";

export function createApp() {
  const app = express();

  // -------------------------------------------------
  // Cookie Parser
  // -------------------------------------------------
  app.use(cookieParser());

  // -------------------------------------------------
  // CORS
  // -------------------------------------------------
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  );

  // -------------------------------------------------
  // Security Headers
  // -------------------------------------------------
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // -------------------------------------------------
  // Generic Middleware
  // -------------------------------------------------
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  // -------------------------------------------------
  // Rate Limiter
  // -------------------------------------------------
  if (rateLimit) {
    app.use(rateLimit);
  }

  // -------------------------------------------------
  // Root Health Route
  // -------------------------------------------------
  app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "API is running!" });
  });

  // -------------------------------------------------
  // API Routes
  // -------------------------------------------------
  app.use("/api", router);

  // -------------------------------------------------
  // Log all API routes (dev only)
  // -------------------------------------------------
  if (env.NODE_ENV !== "production") {
    const logRoutes = (r: any, prefix = "") => {
      r.stack.forEach((layer: any) => {
        if (layer.route) {
          const path = prefix + layer.route.path;
          const methods = Object.keys(layer.route.methods).join(", ").toUpperCase();
          console.log(`[ROUTE] ${methods} ${path}`);
        } else if (layer.name === "router") {
          logRoutes(layer.handle, prefix + (layer.regexp.source.replace("\\/?", "").replace("^", "").replace("\\/?$", "") || ""));
        }
      });
    };
    logRoutes(router, "/api");
  }

  // -------------------------------------------------
  // 404 Handler
  // -------------------------------------------------
  app.use((req, res, next) => {
    next(createError(404, "not_found"));
  });

  // -------------------------------------------------
  // Error Handler
  // -------------------------------------------------
  app.use((err: any, req: any, res: any, _next: any) => {
    console.error("[API ERROR]", err);
    return res.status(err.status || 500).json({
      error: err.code || err.message || "internal_error",
      details: err.details ?? undefined,
    });
  });

  return app;
}
