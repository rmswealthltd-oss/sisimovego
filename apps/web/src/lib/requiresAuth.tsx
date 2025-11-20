// apps/web/src/lib/requiresAuth.tsx
"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function RequiresAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();   // ✅ FIX
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      const redirectTo =
        pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

      router.replace(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    }
  }, [user, loading, router, pathname, searchParams]);

  if (loading || !user) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

  return <>{children}</>;
}
