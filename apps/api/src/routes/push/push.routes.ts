import { Router } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import { PushService } from "../../modules/notifications/push.service";

const router = Router();

/**
 * Send push to a specific user (driver/passenger).
 */
router.post(
  "/user",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId, title, body } = req.body;
    await PushService.sendToUser(userId, { title, body });
    res.json({ ok: true });
  })
);

/**
 * Admin broadcast
 */
router.post(
  "/broadcast",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { userIds, title, body } = req.body;
    const out = await PushService.broadcast({ title, body }, userIds);
    res.json(out);
  })
);

export default router;
