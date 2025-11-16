// src/worker/processors/refund.processor.ts
import prisma from "../../db";
import { sendMpesaPayout } from "../../lib/sendMpesaPay";

/**
 * job.data: { refundId, bookingId, amount }
 *
 * Refunds are executed as external payouts to the passenger phone.
 */
export async function processRefundJob(job: { data: { refundId: string; bookingId: string; amount: number; phone?: string } } | any) {
  const data = job.data ?? job;
  const { refundId, bookingId, amount, phone } = data;

  const refund = await prisma.refund.findUnique({ where: { id: refundId } });
  if (!refund) throw new Error("refund_not_found");

  try {
    // In many setups you refund via the same provider used for payment,
    // otherwise you use a payout mechanism (Mpesa B2C) to the passenger.
    if (!phone) {
      // attempt to fetch phone from booking -> passenger
      const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { passenger: true } });
      if (booking?.passenger?.phone) {
        data.phone = booking.passenger.phone;
      } else {
        throw new Error("passenger_phone_not_found");
      }
    }

    const res = await sendMpesaPayout({ phone: data.phone, amount: amount / 100 }); // sendMpesaPayout expects amount in units (not cents) in our stub

    // mark refund paid
    await prisma.refund.update({
      where: { id: refundId },
      data: { status: "PAID" }
    });

    // ledger entry
    await prisma.ledger.create({
      data: {
        bookingId: bookingId ?? null,
        amount: -amount,
        type: "REFUND",
        description: `Refund executed ${refundId}, providerTx=${res.providerTxId}`
      }
    });

    // outbox: RefundPaid
    await prisma.outbox.create({
      data: {
        aggregateType: "Refund",
        aggregateId: refundId,
        type: "RefundPaid",
        payload: JSON.stringify({ refundId, providerTxId: res.providerTxId }),
        channel: "pubsub",
        status: "READY"
      }
    });

    return true;
  } catch (err: any) {
    console.error("processRefundJob error", err);
    await prisma.dlq.create({
      data: {
        source: "Refund",
        payload: data,
        error: String(err?.message ?? err)
      }
    });
    throw err;
  }
}
