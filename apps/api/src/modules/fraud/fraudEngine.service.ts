// src/modules/fraud/fraudEngine.service.ts
import prisma from "../../db";
import { FraudRuleService } from "./fraudRule.service";
import { FraudScoreService } from "./fraudScore.service";
import { FraudCaseService } from "./fraudCase.service";

export const FraudEngineService = {
  /**
   * Evaluate fraud rules for a refund.
   * Returns: { hits: [...], score }
   */
  async evaluateRefund(refundId: string) {
    const refund = await prisma.refund.findUnique({ where: { id: refundId } });
    if (!refund) throw new Error("refund_not_found");

    const rules = await FraudRuleService.getActiveRules();
    const hits: any[] = [];

    for (const rule of rules) {
      const passed = await FraudRuleService.evaluateRule(rule, refund);
      if (passed) {
        hits.push(rule);
        await prisma.fraudRuleHit.create({
          data: {
            refundId,
            ruleId: rule.id,
            message: `Rule hit: ${rule.name}`
          }
        });
      }
    }

    const score = await FraudScoreService.computeScore(refundId);
    return { hits, score };
  },

  /**
   * Run rules → generate fraud case if score breaches threshold.
   */
  async runRulesAndGenerateCase(refundId: string) {
    const result = await this.evaluateRefund(refundId);

    if (result.score >= 50) {
      const fraudCase = await FraudCaseService.createCase({
        refundId,
        score: result.score,
        summary: "Automatic fraud suspicion based on rule hits."
      });
      return { ...result, fraudCase };
    }

    return result;
  }
};
