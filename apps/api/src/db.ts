// src/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { level: "info", emit: "stdout" },
      { level: "warn", emit: "stdout" },
      { level: "error", emit: "stdout" }
    ],
    errorFormat: "pretty"
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
