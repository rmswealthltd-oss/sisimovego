// src/routes/notifications/push.routes.ts
import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import { PushService } from "../../modules/notifications/push.service";
import { z } from "zod";

const router = Router();

// ----------------------------
// Validation Schemas
// ----------------------------
const SinglePushSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1),
  body: z.string().min(1),
});

const BroadcastSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1),
  title: z.string().min(1),
  body: z.string().min(1),
});

/**
 * POST /api/push/user
 * Authenticated user can send a push to someone (mostly drivers)
 */
router.post(
  "/user",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = SinglePushSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "invalid_payload",
        issues: parsed.error.flatten(),
      });
    }

    const { userId, title, body } = parsed.data;
    await PushService.sendToUser(userId, { title, body });

    return res.json({ ok: true });
  })
);

/**
 * POST /api/push/broadcast
 * Admin-wide broadcast to many users
 */
router.post(
  "/broadcast",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = BroadcastSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "invalid_payload",
        issues: parsed.error.flatten(),
      });
    }

    const { userIds, title, body } = parsed.data;

    const result = await PushService.broadcast(
      { title, body },
      userIds
    );

    return res.json({ ok: true, sent: result });
  })
);

export default router;
