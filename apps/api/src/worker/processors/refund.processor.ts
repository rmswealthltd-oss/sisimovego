import prisma from "../../db";
import { sendMpesaPayout } from "../../lib/sendMpesaPay";

/**
 * job.data: { refundId, bookingId, amount, phone? }
 * amount = cents (integer)
 */
export async function processRefundJob(job: any) {
  const data = job.data ?? job;
  const { refundId, bookingId, amount, phone } = data;

  // 1️⃣ Ensure refund exists
  const refund = await prisma.refund.findUnique({
    where: { id: refundId },
  });
  if (!refund) throw new Error("refund_not_found");

  try {
    // 2️⃣ Determine phone number (prefer job.phone, else passenger.phone)
    let phoneToUse = phone;

    if (!phoneToUse) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { passenger: true },      // ✅ FIXED relation
      });

      if (!booking || !booking.passenger?.phone) {
        throw new Error("passenger_phone_not_found");
      }

      phoneToUse = booking.passenger.phone;
    }

    // 3️⃣ Send M-PESA payout
    const res = await sendMpesaPayout({
      phone: phoneToUse,
      amount: amount / 100,  // cents → KES
    });

    // 4️⃣ Update refund status
    await prisma.refund.update({
      where: { id: refundId },
      data: { status: "PAID" },     // must match your Prisma enum
    });

    // 5️⃣ Ledger entry (bookingId exists in your schema)
   await prisma.ledger.create({
  data: {
    type: "REFUND",
    entityType: "BOOKING",
    entityId: bookingId,
    amount: -amount, // cents → negative for refund
    description: `Refund executed: ${refundId}, providerTx=${res.providerTxId}`,
  },
});

    // 6️⃣ Outbox: RefundPaid
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

    // DLQ schema only supports: payload + reason
    await prisma.dlq.create({
      data: {
        payload: data,
        reason: String(err?.message ?? err),  // ✅ FIXED: no source/error fields
      },
    });

    throw err;
  }
}
