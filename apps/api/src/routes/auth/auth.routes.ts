// src/routes/auth/auth.routes.ts
import { Router } from "express";
import prisma from "../../db";
import { signJwt } from "../../lib/jwt";
import bcrypt from "bcrypt";

const router = Router();

// simple login for dev: POST /api/auth/login { phone }
router.post("/login", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "phone_required" });

  // find or create user (dev flow)
  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({ data: { phone, name: `user-${phone}` } });
  }

  const token = signJwt({ sub: user.id, phone: user.phone, role: "passenger" });
  res.json({ token, user });
});

export default router;
