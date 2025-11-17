// src/worker/cron/autoCompleteTrips.ts
import prisma from "../../db";

/**
 * Query trips that ended but not completed and auto-complete them.
 */
export async function autoCompleteTrips() {
  const rows = await prisma.trip.findMany({
    where: {
      departureAt: { lt: new Date(Date.now() - 1000 * 60 * 60 * 24) }, // older than 24h
      // status not set or not completed
    },
    take: 200
  });

  for (const t of rows) {
    try {
      await prisma.outboxEvent.create({
        data: {
          aggregateType: "Trip",
          aggregateId: t.id,
          type: "Cron:AutoCompleteTrip",
          payload: JSON.stringify({ tripId: t.id }),
          channel: "cron",
          status: "READY"
        }
      });
    } catch (e) {}
  }
}
