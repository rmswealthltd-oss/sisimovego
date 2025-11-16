// src/worker/queues/mpesaQueue.ts
import prisma from "../../db";

export async function enqueueMpesaCallback(payload: any) {
  // store raw callback into outbox to be processed by mpesa processor
  return prisma.outbox.create({
    data: {
      aggregateType: "PaymentCallback",
      aggregateId: payload?.providerTxId ?? `cb_${Date.now()}`,
      type: "MpesaCallback",
      payload: JSON.stringify(payload),
      channel: "worker",
      status: "READY"
    }
  });
}
