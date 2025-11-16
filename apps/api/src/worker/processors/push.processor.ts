// src/worker/processors/push.processor.ts
import prisma from "../../db";
import { sendPushNotification } from "../../lib/push";

/**
 * job.data: { subscription, payload }
 */
export async function processPushJob(job: { data: { subscription: any; payload: any } } | any) {
  const data = job.data ?? job;
  try {
    await sendPushNotification(data.subscription, data.payload);
    return true;
  } catch (err: any) {
    console.error("processPushJob error", err);
    throw err;
  }
}
