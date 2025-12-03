// src/worker/outbox/outbox.sender.ts

import prisma from "../../db";
import { processPayoutJob } from "../processors/payout.processor";
import { processRefundJob } from "../processors/refund.processor";
import { processPushJob } from "../processors/push.processor";
import { processMpesaCallbackJob } from "../processors/mpesa.processor";
import { DLQService } from "../dlq/dlq.service"; // ← use DLQService.sendToDLQ

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
      return processMpesaCallbackJob({ data: payload });

    case "PaymentFailed":
    case "BookingPaid":
      // Informational-only events
      console.log("Informational outbox event:", row.type, payload);
      return true;

    default:
      throw new Error(`unknown_outbox_type:${row.type}`);
  }
}

/**
 * Attempt to send the outbox row.
 * Handles attempts, failure, and DLQ logic.
 */
export async function sendOutboxRow(row: any) {
  try {
    await handleOutboxRow(row);

    // Mark as SENT
    await prisma.outboxEvent.update({
      where: { id: row.id },
      data: {
        status: "SENT",
        processed: true,
        updatedAt: new Date(),
      },
    });

    return true;

  } catch (err: any) {
    console.error("sendOutboxRow error", row.id, err.message ?? err);

    const attempts = (row.attempts ?? 0) + 1;

    if (attempts >= MAX_ATTEMPTS) {
      // Move to DLQ using DLQService
      await DLQService.sendToDLQ(row, String(err?.message ?? err));

      // mark as FAILED
      await prisma.outboxEvent.update({
        where: { id: row.id },
        data: {
          status: "FAILED",
          attempts,
          lastError: String(err?.message ?? err),
          processed: true,
        },
      });

      return false;
    }

    // Increment attempts
    await prisma.outboxEvent.update({
      where: { id: row.id },
      data: {
        attempts,
        lastError: String(err?.message ?? err),
        updatedAt: new Date(),
      },
    });

    return false;
  }
}
