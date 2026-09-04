"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Fixed Toast Portal in Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center p-4 rounded-lg shadow-2xl border transition-all transform duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              toast.type === "success"
                ? "bg-[#111E31] border-[#C4984F]/40 text-white"
                : toast.type === "error"
                ? "bg-[#251214] border-red-500/40 text-white"
                : "bg-[#0B1423] border-[#9E712E]/40 text-white"
            }`}
          >
            <div className="mr-3 flex-shrink-0">
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#C4984F]" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-400" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-[#D8B875]" />}
            </div>
            <div className="text-xs sm:text-sm font-medium flex-grow pr-2">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  return context || { showToast: () => {} };
}
