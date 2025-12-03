// src/worker/queues/mpesaQueue.ts
import prisma from "../../db";
import { randomUUID } from "crypto";

/**
 * Enqueue an incoming M-PESA callback into the Outbox.
 * Worker will later process using processMpesaCallbackJob.
 */
export async function enqueueMpesaCallback(payload: any) {
  if (!payload || typeof payload !== "object") {
    throw new Error("invalid_mpesa_callback_payload");
  }

  const providerTxId =
    payload.providerTxId ||
    payload.MpesaReceiptNumber ||
    `mpesa_cb_${randomUUID()}`; // strong fallback

  return prisma.outboxEvent.create({
    data: {
      aggregateType: "PaymentCallback",
      aggregateId: providerTxId,
      type: "MpesaCallback",
      payload: JSON.stringify(payload),
      channel: "worker",
      status: "READY",
    },
  });
}
