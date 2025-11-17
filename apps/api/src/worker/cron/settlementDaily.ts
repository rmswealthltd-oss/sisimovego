// src/worker/cron/settlementDaily.ts
import prisma from "../../db";

/**
 * Daily settlement: aggregate payouts, produce settlement report (outbox event)
 */
export async function settlementDaily() {
  // summarize payouts from previous day
  const from = new Date();
  from.setDate(from.getDate() - 1);
  const rows = await prisma.payout.findMany({
    where: { createdAt: { gte: from } }
  });

  await prisma.outboxEvent.create({
    data: {
      aggregateType: "Cron",
      aggregateId: `settlement_${Date.now()}`,
      type: "Cron:SettlementDaily",
      payload: JSON.stringify({ count: rows.length }),
      channel: "finance",
      status: "READY"
    }
  });
}
