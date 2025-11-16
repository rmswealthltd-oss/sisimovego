// src/worker/queues/push.queue.ts
import prisma from "../../db";

export async function enqueuePushBroadcast({ userIds, payload }: { userIds: string[]; payload: any }) {
  return prisma.outbox.create({
    data: {
      aggregateType: "PushBroadcast",
      aggregateId: "broadcast_" + Date.now(),
      type: "PushBroadcast",
      payload: JSON.stringify({ userIds, payload }),
      channel: "push",
      status: "READY"
    }
  });
}
