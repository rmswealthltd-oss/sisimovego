// src/worker/processors/push.processor.ts
import prisma from "../../db";
import { sendPushNotification } from "../../lib/push";

/**
 * job.data: { subscription, payload }
 */
export async function processPushJob(job: any) {
  const data = job.data ?? job;
  const { subscription, payload } = data;

  try {
    await sendPushNotification(subscription, payload);

    // Optional: record push delivery (only if your Prisma schema has it)
    // await prisma.pushDelivery.create({
    //   data: {
    //     subscription,
    //     payload,
    //     status: "SENT"
    //   }
    // });

    return true;
  } catch (err: any) {
    console.error("processPushJob error", err);

    // No DLQ here → outbox.sender will handle attempts and DLQ finalization.
    // This is correct because push failures are often retryable.

    throw err;
  }
}
