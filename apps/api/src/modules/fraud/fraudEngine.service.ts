// src/modules/fraud/fraudEngine.service.ts
import prisma from "../../db";

/**
 * FraudEngineService
 * Handles automated fraud checks and scoring for refunds.
 */
export const FraudEngineService = {
  /**
   * Basic fraud check
   * Computes a fraud score (0–100) and flags high-risk refunds.
   */
  async checkRefund(refundId: string) {
    // Fetch refund with booking and user
    const refund = await prisma.refund.findUnique({
      where: { id: refundId },
      include: { booking: true, user: true },
    });

    if (!refund) {
      throw new Error(`Refund not found: ${refundId}`);
    }

    let score = 0;

    // -------------------------------
    // Rule 1: High amount refunds
    // -------------------------------
    if ((refund.amount ?? 0) > 100_000) {
      score += 30;
    }

    // -------------------------------
    // Rule 2: Refund timing
    // -------------------------------
    if (refund.booking) {
      const hoursSinceBooking =
        (refund.createdAt.getTime() - refund.booking.createdAt.getTime()) /
        (1000 * 60 * 60);

      if (hoursSinceBooking < 24) {
        score += 20;
      }
    } else {
      // Missing booking is suspicious
      score += 15;
    }

    // -------------------------------
    // Rule 3: Suspended users
    // -------------------------------
    if (refund.user?.suspended) {
      score += 50;
    }

    // Cap score at 100
    score = Math.min(score, 100);

    return {
      refundId,
      score,
      flagged: score >= 70,
    };
  },

  /**
   * Alias for checkRefund, used for route consistency
   */
  async evaluateRefund(refundId: string) {
    return this.checkRefund(refundId);
  },

  /**
   * Run fraud rules and generate a fraud case if flagged
   */
  async runRulesAndGenerateCase(refundId: string) {
    const { refundId: id, score, flagged } = await this.checkRefund(refundId);

    if (!flagged) return { refundId: id, score, flagged, caseId: null };

    const fraudCase = await prisma.fraudCase.create({
      data: {
        refundId: id,
        score,
        summary: `Auto-generated fraud case for refund ${id}`,
        status: "OPEN",
      },
    });

    return { refundId: id, score, flagged, caseId: fraudCase.id };
  },
};
