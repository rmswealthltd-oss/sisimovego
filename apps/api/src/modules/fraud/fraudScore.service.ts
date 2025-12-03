// src/modules/fraud/fraudScore.service.ts
import { PrismaClient } from "@prisma/client";

export const FraudScoreService = {
  async computeScore(refundId: string, tx: PrismaClient) {
    // fetch events linked to this refund
    const events = await tx.fraudEvent.findMany({
      where: {
        metadata: { path: ["refundId"], equals: refundId }
      }
    });

    const score = events.reduce((sum, e) => sum + e.score, 0);

    return { score, eventCount: events.length };
  }
};
