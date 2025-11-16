// src/routes/push/subscription.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import { PushService } from "../../modules/notifications/push.service";
import { validateBody } from "../../middleware/validate";
import { z } from "zod";

const router = Router();

const subscriptionSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string()
  })
});

router.post(
  "/",
  requireAuth,
  validateBody(subscriptionSchema),
  asyncHandler(async (req, res) => {
    const userId = req.user.sub;
    const sub = await PushService.saveSubscription(userId, req.body);
    res.json({ ok: true, subscription: sub });
  })
);

export default router;
