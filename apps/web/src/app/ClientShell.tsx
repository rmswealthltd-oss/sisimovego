"use client";

/**
 * CLIENT SHELL — Global Providers Wrapper
 *
 * Reference:
 *   /mnt/data/components.docx
 */
import React from "react";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
