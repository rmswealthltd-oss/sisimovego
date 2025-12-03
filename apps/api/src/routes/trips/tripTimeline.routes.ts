// src/routes/trips/tripTimeline.routes.ts
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { asyncHandler } from "../../middleware/asyncHandler";
import { TripStatusAuditService } from "../../modules/trips/tripStatusAudit.service";
import { z } from "zod";

const router = Router();

// Validate tripId (expecting a string UUID or a number – adjust for your DB)
const paramsSchema = z.object({
  tripId: z.string().min(1, "tripId is required")
});

router.get(
  "/:tripId",
  requireAuth,
  asyncHandler(async (req, res) => {
    // Validate input
    const { tripId } = paramsSchema.parse(req.params);

    const timeline = await TripStatusAuditService.getTimeline(tripId);

    if (!timeline || timeline.length === 0) {
      return res.status(404).json({
        message: "No timeline found for this trip"
      });
    }

    return res.json({ timeline });
  })
);

export default router;
