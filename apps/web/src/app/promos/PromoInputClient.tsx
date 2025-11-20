"use client";

import PromoInput from "@/components/PromoInput";

export default function PromoInputClient() {
  function handleApply(code: string) {
    console.log("Apply promo:", code);
  }

  return <PromoInput onApply={handleApply} />;
}
