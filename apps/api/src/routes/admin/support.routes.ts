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
    const tickets = await prisma.supportTicket.findMany({
      include: { user: true },
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
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: req.params.id },
      include: { user: true, messages: true },
    });
    res.json(ticket);
  })
);

// POST /admin/support/:id/reply
router.post(
  "/:id/reply",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const reply = await prisma.supportMessage.create({
      data: {
        ticketId: req.params.id,
        message: req.body.message,
        sender: "ADMIN",
      },
    });
    res.json(reply);
  })
);

export default router;
