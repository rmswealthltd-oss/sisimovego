// src/middleware/requireAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env";

export function requireAuth(req: Request & { user?: any }, res: Response, next: NextFunction) {
  // Pull token from header or cookie
  const headerToken = req.headers.authorization?.split(" ")[1];
  const cookieToken = (req as any).cookies?.auth_token;

  const token = headerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ error: "missing_token" });
  }

  try {
    const payload: any = jwt.verify(token, env.JWT_SECRET);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid_token" });
  }
}
