// src/worker/cron/nightlyFraudEmail.ts
import prisma from "../../db";

/**
 * Summarize fraud alerts and create an outbox event to email ops.
 */
export async function nightlyFraudEmail() {
  const cases = await prisma.fraudEvent.findMany({
    where: { status: "OPEN" },
    take: 200
  });

  await prisma.outboxEvent.create({
    data: {
      aggregateType: "Cron",
      aggregateId: `fraud_summary_${Date.now()}`,
      type: "Cron:NightlyFraudEmail",
      payload: JSON.stringify({ count: cases.length }),
      channel: "admin",
      status: "READY"
    }
  });
}
