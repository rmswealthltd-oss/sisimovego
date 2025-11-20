"use client";

import { useEffect, useState } from "react";
import { confirmStripePayment } from "./stripeActions";

export default function StripeClient({ checkoutId }: { checkoutId: string }) {
  const [status, setStatus] = useState("Checking payment…");

  useEffect(() => {
    async function run() {
      try {
        const result = await confirmStripePayment(checkoutId);
        setStatus(result.status || "Success");
      } catch (e: any) {
        setStatus("Payment failed");
      }
    }
    run();
  }, [checkoutId]);

  return (
    <div className="mt-4 text-gray-800">
      <p>Status: {status}</p>
    </div>
  );
}
