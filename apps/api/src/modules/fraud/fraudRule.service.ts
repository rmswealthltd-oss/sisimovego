// src/modules/fraud/fraudRule.service.ts
import prisma from "../../db";
import vm from "vm";

export const FraudRuleService = {
  async getActiveRules() {
    return prisma.fraudRule.findMany({
      where: { active: true }
    });
  },

  async evaluateRule(rule: any, refund: any): Promise<boolean> {
    const sandbox = {
      refund,
      result: false
    };

    vm.createContext(sandbox);

    try {
      vm.runInContext(rule.script, sandbox);
      return Boolean(sandbox.result);
    } catch (err) {
      console.error(`Fraud rule error (${rule.name}):`, err);
      return false;
    }
  }
};
