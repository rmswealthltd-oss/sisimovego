// src/routes/trips/tripTimeline.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import { TripStatusAuditService } from "../../modules/trips/tripStatusAudit.service";

const router = Router();

router.get(
  "/:tripId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const timeline = await TripStatusAuditService.getTimeline(req.params.tripId);
    res.json({ timeline });
  })
);

export default router;
