// src/middleware/requireAdmin.ts
import { Request, Response, NextFunction } from "express";
import { requireAuth, AuthRequest } from "./requireAuth";
import { UserRole } from "../db";

/**
 * Middleware to ensure the user is authenticated AND an admin.
 * Usage: app.get("/admin", requireAdmin, handler)
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // First, run requireAuth middleware
  await requireAuth(req, res, async () => {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return res.status(401).json({ error: "unauthorized" });
    }

    if (authReq.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "forbidden: admin only" });
    }

    // All good, continue
    next();
  });
}
