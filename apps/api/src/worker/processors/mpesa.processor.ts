import prisma from "../../db";

/**
 * Handles MPESA callback events from Outbox.
 * job.data: { providerTxId: string; payload: any }
 */
export async function processMpesaCallbackJob(job: any) {
  const data = job.data ?? job;
  const { providerTxId, payload } = data;

  try {
    // Create callback row (idempotent by providerTxId if unique)
    await prisma.paymentCallback.create({
      data: {
        provider: "MPESA",
        providerTxId,
        rawPayload: payload,
        status: "RECEIVED",
      },
    });

    return true;

  } catch (err: any) {
    console.error("processMpesaCallbackJob error", err);

    // DLQ — matches schema: payload + reason only
    await prisma.dlq.create({
      data: {
        payload: data,
        reason: String(err?.message ?? err),
      },
    });

    throw err;
  }
}
