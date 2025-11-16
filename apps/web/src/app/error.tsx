// apps/web/app/error.tsx
"use client";

import React from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Unhandled error:", error);

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-xl p-6 bg-white rounded shadow text-center">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-3 text-gray-600">An unexpected error occurred. Try refreshing the page.</p>

          <div className="mt-4 flex justify-center gap-3">
            <button onClick={() => reset()} className="px-4 py-2 bg-primary text-white rounded">Try again</button>
            <button onClick={() => { navigator.clipboard?.writeText(String(error?.stack ?? error?.message ?? "")); alert("Error copied to clipboard"); }} className="px-4 py-2 border rounded">Copy error</button>
          </div>

          <details className="mt-4 text-left text-xs text-gray-500">
            <summary>Technical details</summary>
            <pre className="whitespace-pre-wrap max-h-52 overflow-auto">{String(error?.stack ?? error?.message)}</pre>
          </details>
        </div>
      </body>
    </html>
  );
}
