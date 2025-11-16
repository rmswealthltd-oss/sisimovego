import React from "react";
import { ToastItem } from "../context/ToastContext";

export default function Toast({ t }: { t: ToastItem }) {
  return (
    <div className="max-w-sm rounded-lg shadow-lg p-3 border bg-white">
      <div className="flex items-start gap-3">
        <div className="text-xl">{t.type === "success" ? "✅" : t.type === "error" ? "⛔" : "ℹ️"}</div>
        <div>
          {t.title && <div className="font-semibold">{t.title}</div>}
          <div className="text-sm">{t.message}</div>
        </div>
      </div>
    </div>
  );
}
