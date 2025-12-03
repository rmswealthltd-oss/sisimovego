// src/worker/queues/push.queue.ts
import prisma from "../../db";

/**
 * Enqueue a broadcast push notification.
 *
 * job.data must contain:
 *  - userIds: string[]
 *  - payload: any (push contents)
 */
export async function enqueuePushBroadcast(params: {
  userIds: string[];
  payload: any;
}) {
  const { userIds, payload } = params;

  // Input validation
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("invalid_userIds");
  }

  if (!payload) {
    throw new Error("invalid_payload");
  }

  return prisma.outboxEvent.create({
    data: {
      aggregateType: "PushBroadcast",
      aggregateId: `broadcast_${Date.now()}`,
      type: "PushBroadcast",
      payload: JSON.stringify({ userIds, payload }),
      channel: "push",
      status: "READY",
    },
  });
}
