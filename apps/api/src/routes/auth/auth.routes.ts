import { Router } from "express";
import prisma from "../../db";
import bcrypt from "bcryptjs";
import { signJwt } from "../../lib/jwt";
import { requireAuth } from "../../middleware/requireAuth";

const router = Router();

/**
 * POST /auth/login
 * Web + mobile login (supports cookies & bearer tokens)
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // JWT payload
  const token = signJwt({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  // Attach cookie for web
  res.cookie("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  return res.json({
    ok: true,
    token, // mobile apps & postman use this
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

/**
 * GET /auth/me
 * Returns authenticated user info
 */
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
