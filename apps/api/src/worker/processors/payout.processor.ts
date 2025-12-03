import prisma from "../../db";
import { sendMpesaPayout } from "../../lib/sendMpesaPay";
import { PayoutStatus } from "@prisma/client";   // ✅ FIX

/**
 * job: { payoutId, phone, amount }
 */
export async function processPayoutJob(
  job: { data: { payoutId: string; phone: string; amount: number } } | any
) {
  const data = job.data ?? job;
  const { payoutId, phone, amount } = data;

  const payout = await prisma.payout.findUnique({ where: { id: payoutId } });
  if (!payout) throw new Error("payout_not_found");

  try {
    const res = await sendMpesaPayout({ phone, amount });

    // update payout status
    await prisma.payout.update({
      where: { id: payoutId },
      data: {
        providerTxId: res.providerTxId,
        status: PayoutStatus.COMPLETED,   // ✅ Correct enum
      }
    });

    // outbox
    await prisma.outboxEvent.create({
      data: {
        aggregateType: "Payout",
        aggregateId: payoutId,
        type: "PayoutSent",
        payload: JSON.stringify({
          payoutId,
          providerTxId: res.providerTxId
        }),
        channel: "pubsub",
        status: "READY"
      }
    });

    return true;

  } catch (err: any) {
    console.error("processPayoutJob error", err);

    await prisma.dlq.create({
      data: {
        payload: { payoutId, phone, amount },
        reason: String(err?.message ?? err),
      },
    });

    throw err;
  }
}
