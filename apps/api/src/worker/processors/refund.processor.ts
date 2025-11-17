// src/worker/processors/refund.processor.ts
import prisma from "../../db";
import { sendMpesaPayout } from "../../lib/sendMpesaPay";

export async function processRefundJob(job: { data: { refundId: string; bookingId: string; amount: number; phone?: string } } | any) {
  const data = job.data ?? job;
  const { refundId, bookingId, amount, phone } = data;

  const refund = await prisma.refund.findUnique({ where: { id: refundId } });
  if (!refund) throw new Error("refund_not_found");

  try {
    // get passenger phone if not provided
    if (!phone) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { user: true }, // FIXED
      });

      if (!booking || !booking.user?.phone) {
        throw new Error("passenger_phone_not_found");
      }

      data.phone = booking.user.phone;
    }

    // Send Mpesa payout (convert from cents)
    const res = await sendMpesaPayout({
      phone: data.phone,
      amount: amount / 100,
    });

    // mark refund paid
    await prisma.refund.update({
      where: { id: refundId },
      data: { status: "PAID" },
    });

    // ledger entry — FIXED field name: amountCents
    await prisma.ledger.create({
      data: {
        bookingId: bookingId ?? null,
        amountCents: -amount, // FIXED
        type: "REFUND",
        description: `Refund executed ${refundId}, providerTx=${res.providerTxId}`,
      },
    });

    // outbox: RefundPaid
    await prisma.outboxEvent.create({
      data: {
        aggregateType: "Refund",
        aggregateId: refundId,
        type: "RefundPaid",
        payload: JSON.stringify({
          refundId,
          providerTxId: res.providerTxId,
        }),
        channel: "pubsub",
        status: "READY",
      },
    });

    return true;
  } catch (err: any) {
    console.error("processRefundJob error", err);

    await prisma.dlq.create({
      data: {
        source: "Refund",
        payload: data,
        error: String(err?.message ?? err),
      },
    });

    throw err;
  }
}
