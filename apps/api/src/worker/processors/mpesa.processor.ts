// src/worker/processors/mpesa.processor.ts
import prisma from "../../db";

/**
 * job.data: { providerTxId, payload }
 * This processor reconciles MPESA callback messages that were queued in Outbox.
 */
export async function processMpesaCallbackJob(
  job: { data: { providerTxId: string; payload: any } } | any
) {
  const data = job.data ?? job;
  const { providerTxId, payload } = data;

  try {
    await prisma.paymentCallback.create({
      data: {
        provider: "MPESA",           // ✅ REQUIRED FIELD
        providerTxId,
        rawPayload: payload,
        status: "RECEIVED"
      }
    }).catch(() => null);

    return true;
  } catch (err: any) {
    console.error("processMpesaCallbackJob error", err);
    await prisma.dlq.create({
      data: {
        source: "MpesaCallback",
        payload: data,
        error: String(err?.message ?? err)
      }
    });
    throw err;
  }
}
