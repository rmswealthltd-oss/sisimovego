// src/middleware/requireRole.ts
import { Response, NextFunction } from "express";
import { requireAuth, AuthRequest } from "./requireAuth";

/**
 * Higher-order middleware to require authentication and optionally restrict by role(s)
 * @param roles - list of allowed roles (optional). If omitted, only authentication is required.
 */
export function requireRole(...roles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // First, run requireAuth to ensure user is authenticated
    await requireAuth(req, res, async (err?: any) => {
      if (err) return next(err);

      // Make sure req.user exists
      if (!req.user) return res.status(401).json({ error: "unauthenticated" });

      // If roles are specified, check if user's role matches
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "forbidden" });
      }

      next();
    });
  };
}
