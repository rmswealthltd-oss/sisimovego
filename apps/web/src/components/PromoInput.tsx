"use client";

import { useState } from "react";
import clsx from "clsx";

interface PromoInputProps {
  loading?: boolean;
  defaultValue?: string;
  onApply: (_code: string) => void;
}

export default function PromoInput({
  loading = false,
  defaultValue = "",
  onApply,
}: PromoInputProps) {
  const [code, setCode] = useState(defaultValue);

  function submit() {
    if (!code || loading) return;
    onApply(code.trim());
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") submit();
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="text-sm text-gray-600 mb-1">Promo code</div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Enter promo code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button
          onClick={submit}
          disabled={!code || loading}
          className={clsx(
            "px-4 py-2 rounded-lg text-white transition",
            loading || !code
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
          )}
        >
          {loading ? "..." : "Apply"}
        </button>
      </div>
    </div>
  );
}
