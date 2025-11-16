// apps/web/src/hooks/useSearchParams.ts
"use client";

import { useSearchParams as useNextSearchParams } from "next/navigation";
import { useMemo } from "react";

export function useSearchParams() {
  const params = useNextSearchParams();

  return useMemo(() => {
    const out: Record<string, string> = {};
    params.forEach((v, k) => (out[k] = v));
    return out;
  }, [params]);
}
