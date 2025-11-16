// src/env.ts
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10),

  REDIS_URL: z.string().optional(),

  // Security / CORS
  CORS_ORIGIN: z
    .string()
    .default("*") // or remove default if you want it required
    .optional(),

  // M-Pesa
  MPESA_CONSUMER_KEY: z.string().optional(),
  MPESA_CONSUMER_SECRET: z.string().optional(),
  MPESA_SHORTCODE: z.string().optional(),
  MPESA_PASSKEY: z.string().optional(),

  // Push Notifications (VAPID)
  PUSH_CONTACT_EMAIL: z.string().default("mailto:admin@sisimove.com"),
  PUSH_PUBLIC_KEY: z.string().min(1, "Missing PUSH_PUBLIC_KEY"),
  PUSH_PRIVATE_KEY: z.string().min(1, "Missing PUSH_PRIVATE_KEY"),
});

export const env = envSchema.parse(process.env);
