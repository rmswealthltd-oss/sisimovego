// src/worker/cron/settlementDaily.ts
import prisma from "../../db";

/**
 * Daily settlement summary:
 * Aggregates payouts created in the last 24 hours and emits
 * an Outbox event for the finance settlement processor.
 */
export async function settlementDaily() {
  // 1️⃣ Calculate "yesterday" cutoff
  const from = new Date();
  from.setDate(from.getDate() - 1);

  // 2️⃣ Fetch payouts created since yesterday
  const payouts = await prisma.payout.findMany({
    where: {
      createdAt: { gte: from },
    },
  });

  // 3️⃣ Create Outbox event in correct Prisma schema format
  await prisma.outboxEvent.create({
    data: {
      type: "cron.settlementDaily", // matches your cron naming
      payload: {
        totalPayouts: payouts.length,
        generatedAt: new Date().toISOString(),
      },
    },
  });
}
