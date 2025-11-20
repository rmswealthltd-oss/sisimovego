"use client";

import { useState } from "react";
import { startMpesaStkPush, pollMpesaStatus } from "./mpesaActions";

export default function MpesaClient({ checkoutId }: { checkoutId: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("INIT");

  async function initiate() {
    try {
      setLoading(true);
      setStatus("REQUESTING");

      const res = await startMpesaStkPush({
        phone: "2547XXXXXXXX",
        amountCents: 1000,
        bookingId: checkoutId,
      });

      setStatus("PENDING");

      const poll = await pollMpesaStatus(res.requestId);
      setStatus(poll.status);

    } catch (e: any) {
      setStatus("ERROR");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={initiate}
        disabled={loading}
      >
        Pay with MPESA
      </button>

      <div className="mt-3 text-gray-800">Status: {status}</div>
    </div>
  );
}
