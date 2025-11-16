// src/middleware/requireAdmin.ts
import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "unauthorized" });
  if (!user.role || user.role !== "admin") return res.status(403).json({ error: "forbidden" });
  next();
}
