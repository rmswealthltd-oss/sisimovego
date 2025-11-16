import React, { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";
export type ToastItem = { id: string; type: ToastType; title?: string; message: string; ttl?: number };

const ToastContext = createContext<{
  toasts: ToastItem[];
  show: (t: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}>({
  toasts: [],
  show: () => {},
  dismiss: () => {}
});

export function useToast() {
  return useContext(ToastContext);
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((t: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const ttl = t.ttl ?? 5000;
    const item: ToastItem = { id, ttl, ...t };
    setToasts((s) => [item, ...s]);
    if (ttl && ttl > 0) {
      setTimeout(() => dismiss(id), ttl);
    }
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toasts, show, dismiss }}>
      {children}
      {/* Mount container at top-right */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 items-end pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <div className={`max-w-sm rounded-lg shadow-lg p-3 border ${toastBg(t.type)}`}>
              <div className="flex items-start gap-3">
                <div className="text-xl">{toastIcon(t.type)}</div>
                <div className="flex-1">
                  {t.title && <div className="font-semibold">{t.title}</div>}
                  <div className="text-sm">{t.message}</div>
                </div>
                <button onClick={() => dismiss(t.id)} className="ml-3 text-xs text-gray-500">✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

function toastBg(type: ToastType) {
  switch (type) {
    case "success": return "bg-white border-green-200";
    case "error": return "bg-white border-red-200";
    case "warning": return "bg-white border-yellow-200";
    case "info":
    default: return "bg-white border-blue-200";
  }
}

function toastIcon(type: ToastType) {
  switch (type) {
    case "success": return "✅";
    case "error": return "⛔";
    case "warning": return "⚠️";
    case "info": return "ℹ️";
    default: return "ℹ️";
  }
}
