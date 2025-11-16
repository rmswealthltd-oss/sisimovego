// src/modules/fraud/fraudRule.service.ts
import prisma from "../../db";

export const FraudRuleService = {
  async getActiveRules() {
    return prisma.fraudRule.findMany({ where: { active: true } });
  },

  /**
   * rule.expression — e.g. JSON logic or simple JS condition
   * For now, we implement simple template rules.
   */
  async evaluateRule(rule: any, refund: any): Promise<boolean> {
    switch (rule.type) {
      case "HIGH_AMOUNT":
        return refund.amount > 50000; // > KES 500
      case "MULTI_REFUNDS":
        const count = await prisma.refund.count({
          where: { bookingId: refund.bookingId, status: "PENDING" }
        });
        return count > 1;
      default:
        return false;
    }
  }
};
