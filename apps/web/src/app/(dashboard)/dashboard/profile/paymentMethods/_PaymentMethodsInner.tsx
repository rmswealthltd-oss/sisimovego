"use client";

import React, { useEffect, useState } from "react";
import { Api } from "../../../../../lib/api";

export default function PaymentMethodsInner() {
  const [methods, setMethods] = useState<any[]>([]);

  useEffect(() => {
    Api.get("/payments/methods").then((res) => setMethods(res.methods || []));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Payment Methods</h1>

      <div className="space-y-3">
        {methods.map((m) => (
          <div
            key={m.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{m.brand?.toUpperCase()}</div>
              <div className="text-sm text-gray-500">**** {m.last4}</div>
            </div>

            <button
              className="px-3 py-1 text-sm border rounded"
              onClick={async () => {
                await Api.del(`/payments/methods/${m.id}`);
                setMethods(methods.filter((x) => x.id !== m.id));
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div>
        <button
          className="px-4 py-2 bg-primary text-white rounded"
          onClick={() => alert("Redirect to Stripe add method")}
        >
          Add New Card
        </button>
      </div>
    </div>
  );
}
