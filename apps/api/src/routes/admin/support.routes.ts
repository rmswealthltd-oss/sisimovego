// src/routes/admin/support.routes.ts
import { Router } from "express";
import prisma from "../../db";
import { requireAdmin } from "../../middleware/requireAdmin";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();

// GET /admin/support
router.get(
  "/",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const tickets = await prisma.support.findMany({
      where: { parentId: null }, // only top-level tickets
      include: { user: true, replies: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(tickets);
  })
);

// GET /admin/support/:id
router.get(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const ticket = await prisma.support.findUnique({
      where: { id: req.params.id },
      include: { user: true, replies: true },
    });

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.json(ticket);
  })
);

// POST /admin/support/:id/reply
router.post(
  "/:id/reply",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const reply = await prisma.support.create({
      data: {
        parentId: req.params.id,
        userId: req.body.userId, // optional, can use admin ID if needed
        message: req.body.message,
        sender: "ADMIN",
      },
      include: { user: true },
    });

    res.json(reply);
  })
);

export default router;
