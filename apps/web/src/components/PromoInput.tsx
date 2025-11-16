"use client";

import { useState } from "react";
import clsx from "clsx";

interface PromoInputProps {
  loading?: boolean;
  defaultValue?: string;
  onApply: (code: string) => void;
}

export default function PromoInput({
  loading = false,
  defaultValue = "",
  onApply
}: PromoInputProps) {
  const [code, setCode] = useState(defaultValue);

  function submit() {
    if (!code || loading) return;
    onApply(code.trim());
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="text-sm text-gray-600 mb-1">Promo code</div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="Enter promo code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={!code || loading}
          className={clsx(
            "px-4 py-2 rounded-lg text-white transition",
            loading || !code
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          {loading ? "..." : "Apply"}
        </button>
      </div>
    </div>
  );
}
