import { toast, type Toast } from "react-hot-toast";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

interface CustomToastProps {
  t: Toast;
}

export default function CustomToast({ t }: CustomToastProps) {
  const isError   = t.type === "error";
  const isSuccess = t.type === "success";

  const accentColor = isError
    ? "bg-risk-high"
    : isSuccess
    ? "bg-risk-low"
    : "bg-brand-green";

  const Icon = isError
    ? XCircle
    : isSuccess
    ? CheckCircle2
    : Info;

  const iconColor = isError
    ? "text-risk-high"
    : isSuccess
    ? "text-risk-low"
    : "text-brand-green";

  const message =
    typeof t.message === "string"
      ? t.message
      : null;

  return (
    <div
      className={`
        flex items-start gap-3 
        bg-brand-surface border border-border-main/70
        shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12),0_2px_8px_-2px_rgba(0,0,0,0.06)]
        rounded-xl px-4 py-3 max-w-sm w-full
        transition-all duration-300 ease-out
        ${t.visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
        }
      `}
      style={{ minWidth: 260 }}
    >
      {/* Left accent bar */}
      <div className={`w-[3px] self-stretch rounded-full shrink-0 ${accentColor} opacity-80`} />

      {/* Icon */}
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} strokeWidth={2} />

      {/* Message */}
      <p className="font-sans text-[13px] font-medium text-text-main leading-snug flex-1">
        {message}
      </p>

      {/* Dismiss button */}
      <button
        onClick={() => toast.dismiss(t.id)}
        className="shrink-0 mt-0.5 p-0.5 rounded-md text-text-sub/40 hover:text-text-sub hover:bg-border-main/40 transition-colors duration-150 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
