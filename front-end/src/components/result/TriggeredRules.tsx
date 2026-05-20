import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface TriggeredRulesProps {
  rules: string[];
}

export default function TriggeredRules({ rules }: TriggeredRulesProps) {
  const hasRules = rules && rules.length > 0;

  return (
    <div id="aturan" className="bg-brand-surface rounded-xl border border-border-main overflow-hidden">
      {/* Header — micro-uppercase pattern from MONGODESIGN */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-main">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-risk-medium" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.07em] text-text-sub">
            Red Flags Terdeteksi
          </span>
        </div>
        {hasRules && (
          <span className="font-mono text-[11px] font-medium text-risk-medium bg-risk-medium/10 border border-risk-medium/20 px-2 py-0.5 rounded-full">
            {rules.length}
          </span>
        )}
      </div>

      {/* Content — body-sm (14px) */}
      <div className="px-5 py-4">
        {hasRules ? (
          <ul className="space-y-2.5">
            {rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="font-mono text-[11px] text-text-sub/40 mt-0.5 w-4 shrink-0 text-right select-none">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-sm text-text-main leading-[1.5]">{rule}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-2 text-risk-low">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-sans text-sm">Tidak ada red flag terdeteksi</span>
          </div>
        )}
      </div>
    </div>
  );
}
