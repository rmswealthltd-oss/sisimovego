// src/env.ts
import { z } from "zod";
import dotenv from "dotenv";

// Load .env before parsing
dotenv.config();

/**
 * Normalize CORS origins
 */
const corsOriginParser = z
  .string()
  .default("*")
  .transform((origins) => {
    if (origins === "*") return "*";
    return origins
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
  });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is missing"),
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 chars"),
  QR_JWT_SECRET: z.string().min(10, "QR_JWT_SECRET must be at least 10 chars"),

  REDIS_URL: z.string().optional(),

  // CORS
  CORS_ORIGIN: corsOriginParser,

  // M-Pesa
  MPESA_CONSUMER_KEY: z.string().optional(),
  MPESA_CONSUMER_SECRET: z.string().optional(),
  MPESA_SHORTCODE: z.string().optional(),
  MPESA_PASSKEY: z.string().optional(),

  // Push Notifications
  PUSH_CONTACT_EMAIL: z.string().default("mailto:admin@sisimove.com"),
  PUSH_PUBLIC_KEY: z.string().min(1, "Missing PUSH_PUBLIC_KEY"),
  PUSH_PRIVATE_KEY: z.string().min(1, "Missing PUSH_PRIVATE_KEY"),

  // -------------------------
  // ✅ EMAIL CONFIG
  // -------------------------
  EMAIL_SMTP_HOST: z.string().min(1, "Missing EMAIL_SMTP_HOST"),
  EMAIL_SMTP_PORT: z.coerce.number().default(587),
  EMAIL_SMTP_USER: z.string().min(1, "Missing EMAIL_SMTP_USER"),
  EMAIL_SMTP_PASS: z.string().min(1, "Missing EMAIL_SMTP_PASS"),
  EMAIL_FROM: z.string().default("no-reply@sisimove.com"),
  EMAIL_SECURE: z
    .string()
    .default("false")
    .transform((v) => v === "true"), // convert "true" → true
});

let env: z.infer<typeof envSchema>;
try {
  env = envSchema.parse(process.env);
} catch (err: any) {
  console.error("\n❌ Invalid environment variables:");
  console.error(err.errors);
  process.exit(1);
}

export { env };
