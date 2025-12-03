// src/worker/cron/nightlyFraudEmail.ts
import prisma from "../../db";

/**
 * Summarize recent fraud alerts and create an outbox event to email ops.
 * Only considers fraud events created in the last 24 hours.
 */
export async function nightlyFraudEmail() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // last 24h

  // Fetch recent fraud events
  const recentFraudEvents = await prisma.fraudEvent.findMany({
    where: {
      createdAt: { gte: since },
    },
    take: 200,
  });

  // Create outbox event for ops
  await prisma.outboxEvent.create({
    data: {
      aggregateType: "Cron",
      aggregateId: `fraud_summary_${Date.now()}`,
      type: "Cron:NightlyFraudEmail",
      payload: JSON.stringify({ count: recentFraudEvents.length }),
      channel: "admin",
      status: "READY",
    },
  });

  return { processed: recentFraudEvents.length };
}
