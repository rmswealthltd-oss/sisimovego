// src/modules/fraud/fraudScore.service.ts
import prisma from "../../db";

export const FraudScoreService = {
  async computeScore(refundId: string) {
    const hits = await prisma.fraudRuleHit.findMany({ where: { refundId } });
    return hits.length * 20; // each rule = +20 points
  }
};
