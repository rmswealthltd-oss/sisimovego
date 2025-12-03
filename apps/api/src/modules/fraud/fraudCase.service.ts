// src/modules/fraud/fraudCase.service.ts
import { FraudEngineService } from "./fraudEngine.service";

import prisma from "../../db";

const VALID_STATUSES = ["OPEN", "REVIEWING", "RESOLVED", "CLOSED"] as const;

export const FraudCaseService = {
  async createCase({ refundId, score, summary }: {
    refundId: string;
    score: number;
    summary: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const row = await tx.fraudCase.create({
        data: {
          refundId,
          score,
          summary,
          status: "OPEN"
        }
      });

      await tx.outboxEvent.create({
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
    });
  },

  async listCases({ page = 1, pageSize = 50 } = {}) {
    const skip = (page - 1) * pageSize;

    const [total, rows] = await Promise.all([
      prisma.fraudCase.count(),
      prisma.fraudCase.findMany({
        orderBy: { createdAt: "desc" },
        include: { refund: true },
        skip,
        take: pageSize
      })
    ]);

    return { total, rows, page, pageSize };
  },

  async updateStatus(caseId: string, status: string) {
    if (!VALID_STATUSES.includes(status as any)) {
      throw new Error(`Invalid fraud case status: ${status}`);
    }

    return prisma.fraudCase.update({
      where: { id: caseId },
      data: { status }
    });
  }
};
