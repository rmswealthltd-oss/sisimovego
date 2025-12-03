// src/routes/admin/users.routes.ts
import { Router } from "express";
import prisma from "../../db";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

/**
 * GET /api/admin/users
 * List all users
 */
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        driver: true,
        wallets: true,
        tripsPosted: true,
        bookings: true,
        ratingsGiven: true,
        ratingsReceived: true,
      },
    });

    res.json(users);
  })
);

/**
 * GET /api/admin/users/:id
 * Get user profile + trips
 */
router.get(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        driver: true,
        wallets: true,
        tripsPosted: true,
        bookings: true,
        ratingsGiven: true,
        ratingsReceived: true,
      },
    });

    if (!user) return res.status(404).json({ error: "not_found" });

    res.json(user);
  })
);

/**
 * GET /api/admin/users/:id/trips
 */
router.get(
  "/:id/trips",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const trips = await prisma.trip.findMany({
      where: { ownerId: req.params.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(trips);
  })
);

/**
 * PUT /api/admin/users/:id
 * Update user (firstName, middleName, lastName, email, phone)
 */
router.put(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { firstName, middleName, lastName, email, phone } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!user) return res.status(404).json({ error: "not_found" });

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: firstName ?? user.firstName,
        middleName: middleName ?? user.middleName,
        lastName: lastName ?? user.lastName,
        email: email ?? user.email,
        phone: phone ?? user.phone,
      },
    });

    res.json(updated);
  })
);

/**
 * DELETE /api/admin/users/:id
 */
router.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!user) return res.status(404).json({ error: "not_found" });

    await prisma.user.delete({
      where: { id: user.id },
    });

    res.json({ ok: true, deleted: true });
  })
);

/**
 * POST /api/admin/users/:id/suspend
 */
router.post(
  "/:id/suspend",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!user) return res.status(404).json({ error: "not_found" });

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { suspended: true },
    });

    res.json({ ok: true, user: updated });
  })
);

/**
 * POST /api/admin/users/:id/activate
 */
router.post(
  "/:id/activate",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!user) return res.status(404).json({ error: "not_found" });

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { suspended: false },
    });

    res.json({ ok: true, user: updated });
  })
);

export default router;
