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

  // ---------------------------------------------
  // Cookie parser (NEEDED for auth)
  // ---------------------------------------------
  app.use(cookieParser());

  // ---------------------------------------------
  // CORS (must allow 5173)
  // ---------------------------------------------
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      credentials: true,
    })
  );

  // ---------------------------------------------
  // Helmet (must allow cookies from frontend)
  // ---------------------------------------------
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );

  app.use(compression());
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  if (rateLimit) app.use(rateLimit);

  // API Routes
  app.use("/api", router);

  // 404 fallback
  app.use((req, res, next) => {
    next(createError(404, "not_found"));
  });

  // Error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("[API ERROR]", err);
    res.status(err.status || 500).json({
      error: err.code || err.message || "internal_error",
      details: err.details ?? undefined,
    });
  });

  return app;
}
