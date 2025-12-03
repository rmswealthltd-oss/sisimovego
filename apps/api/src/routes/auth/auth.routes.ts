//apps/api/src/routes/auth/auth.routes.ts
import { Router, Request, Response } from "express";
import prisma, { UserRole } from "../../db";
import bcrypt from "bcryptjs";
import { signJwt } from "../../lib/jwt";
import { requireAuth, AuthUser, AuthRequest } from "../../middleware/requireAuth";

const router = Router();

/**
 * POST /api/auth/login
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    // cast role safely
    const role: AuthUser["role"] =
      user.role === UserRole.USER || user.role === UserRole.DRIVER || user.role === UserRole.ADMIN
        ? user.role
        : UserRole.USER;

    const token = signJwt({
      sub: user.id,
      email: user.email,
      role,
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName ?? null,
        lastName: user.lastName,
        fullName: [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" "),
        role,
        governmentIdStatus: user.governmentIdStatus,
        driverLicenseStatus: user.driverLicenseStatus,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/auth/me
 */
router.get("/me", requireAuth, (req: Request, res: Response) => {
  const authReq = req as AuthRequest; // cast to access user
  if (!authReq.user) return res.status(401).json({ message: "Unauthorized" });

  return res.json({ user: authReq.user });
});

export default router;
