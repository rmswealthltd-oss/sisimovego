// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import createError from "http-errors";

import { env } from "./env";
import router from "./routes";
import { rateLimit } from "./middleware/rateLimit";

export function createApp() {
  const app = express();

  // -------------------------------------------------------
  // Security / middleware
  // -------------------------------------------------------
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  // Optional rate limiting
  if (rateLimit) {
    app.use(rateLimit);
  }

  // -------------------------------------------------------
  // Mount API routes
  // -------------------------------------------------------
  app.use("/api", router);

  // -------------------------------------------------------
  // 404 fallback
  // -------------------------------------------------------
  app.use((req, res, next) => {
    next(createError(404, "not_found"));
  });

  // -------------------------------------------------------
  // Global error handler
  // -------------------------------------------------------
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("[API ERROR]", err);

    res.status(err.status || 500).json({
      error: err.code || err.message || "internal_error",
      details: err.details ?? undefined,
    });
  });

  return app;
}
