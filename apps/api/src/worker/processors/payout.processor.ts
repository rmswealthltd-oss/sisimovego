// src/worker/processors/payout.processor.ts
import prisma from "../../db";
import { sendMpesaPayout } from "../../lib/sendMpesaPay";

/**
 * job: { payoutId, phone, amount }
 */
export async function processPayoutJob(job: { data: { payoutId: string; phone: string; amount: number } } | any) {
  const data = job.data ?? job;
  const { payoutId, phone, amount } = data;

  const payout = await prisma.payout.findUnique({ where: { id: payoutId } });
  if (!payout) throw new Error("payout_not_found");

  try {
    const res = await sendMpesaPayout({ phone, amount });

    // update payout status
    await prisma.payout.update({
      where: { id: payoutId },
      data: { providerTxId: res.providerTxId, status: res.status ?? "SENT" }
    });

    // outbox: publish payout sent event
    await prisma.outboxEvent.create({
      data: {
        aggregateType: "Payout",
        aggregateId: payoutId,
        type: "PayoutSent",
        payload: JSON.stringify({ payoutId, providerTxId: res.providerTxId }),
        channel: "pubsub",
        status: "READY"
      }
    });

    return true;
  } catch (err: any) {
    console.error("processPayoutJob error", err);
    // create DLQ entry; caller may let retry happen
    await prisma.dlq.create({
      data: {
        source: "Payout",
        payload: { payoutId, phone, amount },
        error: String(err?.message ?? err)
      }
    });
    throw err;
  }
}
