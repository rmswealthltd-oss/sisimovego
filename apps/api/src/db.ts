// src/db.ts
import { PrismaClient, Prisma, PayoutStatus, UserRole, WalletType } from "@prisma/client";

/**
 * Prevent multiple Prisma instances in dev (important for Next.js / ts-node)
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prisma Client instance
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { level: "info", emit: "stdout" },
      { level: "warn", emit: "stdout" },
      { level: "error", emit: "stdout" },
    ],
    errorFormat: "pretty",
  });

// Store Prisma instance ONLY in dev mode
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Export Prisma namespace and enums
 * so services can import:
 *   import prisma, { Prisma, PayoutStatus, UserRole, WalletType } from "../../db";
 */
export { Prisma, PayoutStatus, UserRole, WalletType };

export default prisma;
