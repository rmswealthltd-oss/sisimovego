// src/routes/push/subscription.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import { PushService } from "../../modules/notifications/push.service";
import { validateBody } from "../../middleware/validate";
import { z } from "zod";

const router = Router();

// ----------------------------
// Subscription Validation
// ----------------------------
const subscriptionSchema = z.object({
  endpoint: z.string().url("Invalid subscription endpoint"),
  keys: z.object({
    p256dh: z.string().min(1, "Missing p256dh key"),
    auth: z.string().min(1, "Missing auth key"),
  }),
});

/**
 * POST /api/push/subscription
 * Save browser push subscription for the logged-in user
 */
router.post(
  "/",
  requireAuth,
  validateBody(subscriptionSchema),
  asyncHandler(async (req, res) => {
    const userId = (req as any).user.sub; // requireAuth guarantees this

    const saved = await PushService.saveSubscription(userId, {
      endpoint: req.body.endpoint,
      keys: req.body.keys,
    });

    return res.json({
      ok: true,
      subscription: saved,
    });
  })
);

export default router;
