
//apps/api/src/middleware/requireAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { env } from "../env";
import prisma, { UserRole } from "../db";

export interface AuthUser {
  id: string;
  email: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  role: UserRole;
}

// extend Request locally
export interface AuthRequest extends Request {
  user?: AuthUser;
}

interface JwtPayload {
  sub: string;
  role?: UserRole;
  iat?: number;
  exp?: number;
}

// Middleware
export async function requireAuth(
  req: Request, // 👈 Use standard Express Request
  res: Response,
  next: NextFunction
) {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.includes(" ")) {
      const [scheme, value] = authHeader.split(" ");
      if (scheme.toLowerCase() === "bearer" && value) token = value;
    }
    if (!token && req.cookies) token = req.cookies.auth_token;

    if (!token) return res.status(401).json({ error: "missing_token" });

    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const userFromDb = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        middleName: true,
        lastName: true,
        role: true,
      },
    });

    if (!userFromDb) return res.status(401).json({ error: "user_not_found" });

    // Cast role safely
    let role: UserRole;
    if (
      userFromDb.role === UserRole.USER ||
      userFromDb.role === UserRole.DRIVER ||
      userFromDb.role === UserRole.ADMIN
    ) {
      role = userFromDb.role;
    } else if (payload.role) {
      role = payload.role;
    } else {
      role = UserRole.USER;
    }

    // Attach to req as AuthRequest
    (req as AuthRequest).user = {
      id: userFromDb.id,
      email: userFromDb.email ?? null,
      firstName: userFromDb.firstName,
      middleName: userFromDb.middleName ?? null,
      lastName: userFromDb.lastName,
      role,
    };

    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) return res.status(401).json({ error: "token_expired" });
    if (err instanceof JsonWebTokenError) return res.status(401).json({ error: "invalid_token" });

    console.error("Auth error:", err);
    return res.status(500).json({ error: "auth_failed" });
  }
}
