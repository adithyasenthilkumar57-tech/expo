"use client";
import { useToastStore, type ToastItem } from "@/lib/toast";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItemCard key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItemCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/25 bg-[#0C161C]/95 text-emerald-100",
    error: "border-red-500/25 bg-[#1C0C0F]/95 text-red-100",
    warning: "border-amber-500/25 bg-[#1C160C]/95 text-amber-100",
    info: "border-blue-500/25 bg-[#0C1220]/95 text-blue-100",
  };

  return (
    <div
      className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 transition-all animate-slideUp ${borders[toast.type]}`}
      role="status"
      aria-live="polite"
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-xs font-bold text-white mb-0.5 tracking-tight">{toast.title}</p>
        )}
        <p className="text-xs text-slate-300 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors flex-shrink-0"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
