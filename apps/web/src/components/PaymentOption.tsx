"use client";

import { Check } from "lucide-react";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

interface PaymentOptionProps {
  value: "mpesa" | "stripe";
  label: string;
  description?: string;
  selected: "mpesa" | "stripe" | null;
  onSelect: Dispatch<SetStateAction<"mpesa" | "stripe">>;
}

export default function PaymentOption({
  value,
  label,
  description,
  selected,
  onSelect
}: PaymentOptionProps) {
  const active = selected === value;

  return (
    <div
      onClick={() => onSelect(value)}
      className={clsx(
        "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition",
        active
          ? "border-primary bg-primary/5"
          : "hover:bg-gray-50 border-gray-300"
      )}
    >
      <div>
        <div className="font-medium">{label}</div>
        {description && (
          <div className="text-sm text-gray-600">{description}</div>
        )}
      </div>

      {active && <Check className="text-primary" strokeWidth={2} />}
    </div>
  );
}
