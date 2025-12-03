// src/worker/cron/autoCompleteTrips.ts
import prisma from "../../db";
import { TripStatus } from "@prisma/client";
import { TripService } from "../../modules/trips/trip.service";

export async function autoCompleteTrips(batchSize = 100) {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let processedCount = 0;
  let lastId: string | undefined = undefined;
  let hasMore = true;

  while (hasMore) {
    const trips: { id: string }[] = await prisma.trip.findMany({
      where: {
        date: { lt: cutoff },
        status: { in: [TripStatus.ACTIVE, TripStatus.COMPLETED] },
      },
      select: { id: true },
      take: batchSize,
      orderBy: { id: "asc" },
      ...(lastId ? { cursor: { id: lastId }, skip: 1 } : {}),
    });

    if (trips.length === 0) {
      hasMore = false;
      break;
    }

    for (const trip of trips) {
      const currentTrip: { id: string } = trip;

      try {
        // Skip if outbox event already exists
        const existingEvent = await prisma.outboxEvent.findFirst({
          where: {
            aggregateType: "Trip",
            aggregateId: currentTrip.id,
            type: "Cron:AutoCompleteTrip",
            status: "READY",
          },
        });
        if (existingEvent) continue;

        // Force complete the trip
        await TripService.forceComplete(currentTrip.id);

        // Create outbox event
        await prisma.outboxEvent.create({
          data: {
            aggregateType: "Trip",
            aggregateId: currentTrip.id,
            type: "Cron:AutoCompleteTrip",
            payload: JSON.stringify({ tripId: currentTrip.id }),
            channel: "cron",
            status: "READY",
          },
        });

        processedCount++;
        lastId = currentTrip.id; // update cursor
      } catch (err) {
        console.error(`Failed to auto-complete trip ${currentTrip.id}`, err);
      }
    }
  }

  return { processed: processedCount };
}
