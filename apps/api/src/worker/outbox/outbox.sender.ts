// src/worker/outbox/outbox.sender.ts
import prisma from "../../db";
import { processPayoutJob } from "../processors/payout.processor";
import { processRefundJob } from "../processors/refund.processor";
import { processPushJob } from "../processors/push.processor";
import { processMpesaCallbackJob } from "../processors/mpesa.processor";
import { moveToDLQ } from "../dlq/dlq.service";

const MAX_ATTEMPTS = 5;

/**
 * Dispatch an outbox row to the correct processor based on type.
 * Returns true on success, throws on failure.
 */
export async function handleOutboxRow(row: any) {
  const payload = JSON.parse(row.payload ?? "{}");
  switch (row.type) {
    case "PayoutRequested":
      return processPayoutJob({ data: payload });
    case "RefundRequested":
      return processRefundJob({ data: payload });
    case "PushSend":
      return processPushJob({ data: payload });
    case "MpesaCallback":
    case "PaymentFailed":
    case "BookingPaid":
      // some Outbox events may be informational and not require processing here
      console.log("Informational outbox event:", row.type, payload);
      return true;
    default:
      // unknown type -> move to DLQ
      throw new Error(`unknown_outbox_type:${row.type}`);
  }
}

/**
 * Attempt to send the outbox row. Handles attempt counting and DLQ on permanent failure.
 */
export async function sendOutboxRow(row: any) {
  try {
    await handleOutboxRow(row);
    // mark SENT
    await prisma.outboxEvent.update({
      where: { id: row.id },
      data: { status: "SENT", updatedAt: new Date() }
    });
    return true;
  } catch (err: any) {
    console.error("sendOutboxRow error", row.id, err.message ?? err);
    const attempts = (row.attempts ?? 0) + 1;

    if (attempts >= MAX_ATTEMPTS) {
      // move to DLQ
      await moveToDLQ({
        source: "Outbox",
        payload: { outboxId: row.id, type: row.type, payload: row.payload },
        error: String(err?.message ?? err)
      });
      // mark outbox as FAILED
      await prisma.outboxEvent.update({
        where: { id: row.id },
        data: { status: "FAILED", attempts, lastError: String(err?.message ?? err) }
      });
      return false;
    } else {
      // increment attempts and record lastError
      await prisma.outboxEvent.update({
        where: { id: row.id },
        data: { attempts, lastError: String(err?.message ?? err) }
      });
      return false;
    }
  }
}
