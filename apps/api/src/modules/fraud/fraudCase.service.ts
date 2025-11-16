// src/modules/fraud/fraudCase.service.ts
import prisma from "../../db";

export const FraudCaseService = {
  async createCase({ refundId, score, summary }: { refundId: string; score: number; summary: string }) {
    const row = await prisma.fraudCase.create({
      data: { refundId, score, summary, status: "OPEN" }
    });

    await prisma.outbox.create({
      data: {
        aggregateType: "FraudCase",
        aggregateId: row.id,
        type: "FraudCaseOpened",
        payload: JSON.stringify({ caseId: row.id, refundId, score }),
        channel: "pubsub",
        status: "READY"
      }
    });

    return row;
  },

  async listCases() {
    return prisma.fraudCase.findMany({
      orderBy: { createdAt: "desc" },
      include: { refund: true }
    });
  },

  async updateStatus(caseId: string, status: string) {
    return prisma.fraudCase.update({ where: { id: caseId }, data: { status } });
  }
};
