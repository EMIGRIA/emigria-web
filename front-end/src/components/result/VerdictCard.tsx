import { getRiskColor, getRiskLabel, formatPctDirect, formatPct } from "../../lib/riskUtils";
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from "lucide-react";

interface VerdictCardProps {
  verdict: {
    risk_level: string;
    ml_fraud_probability: number | null;
    final_risk_percentage?: number | null;
    hard_stop_triggered?: boolean;
  };
  summaryText: string;
}

export default function VerdictCard({ verdict, summaryText }: VerdictCardProps) {
  const { risk_level, ml_fraud_probability, final_risk_percentage, hard_stop_triggered } = verdict;
  const colorClass = getRiskColor(risk_level);
  const label = getRiskLabel(risk_level);

  // Primary score: prefer final_risk_percentage from hybrid model, fallback to ml_fraud_probability
  const primaryScore = final_risk_percentage != null
    ? formatPctDirect(final_risk_percentage)
    : formatPct(ml_fraud_probability);

  const numericPct = final_risk_percentage != null
    ? Math.round(final_risk_percentage)
    : ml_fraud_probability != null
      ? Math.round(ml_fraud_probability * 100)
      : 0;

  const Icon = () => {
    const l = risk_level?.toLowerCase();
    if (l === "low")                      return <CheckCircle2 className="w-4 h-4 text-risk-low" />;
    if (l === "high" || l === "critical") return <XCircle className="w-4 h-4 text-risk-high" />;
    return <AlertTriangle className="w-4 h-4 text-text-muted" />;
  };

  return (
    <div
      id="ringkasan"
      className={`rounded-2xl border p-6 md:p-7 shadow-sm hover:shadow-md hover:scale-[1.01] hover:border-current/30 transition-all duration-300 ease-out cursor-default animate-[fadeInUp_0.4s_ease_both] ${colorClass}`}
    >
      {/* Risk label */}
      <div className="flex items-center gap-2 mb-4">
        <Icon />
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em]">
          {label}
        </span>
        {hard_stop_triggered && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-risk-high bg-risk-high/15 px-2.5 py-0.5 rounded-full">
            <ShieldAlert className="w-3 h-3" />
            Hard Stop
          </span>
        )}
      </div>

      {/* Summary */}
      <p className="font-sans text-xl md:text-[22px] font-medium leading-[1.35] mb-5 tracking-[-0.02em]">
        {summaryText}
      </p>

      {/* Primary Score */}
      {primaryScore != null && (
        <div className="border-t border-current/10 pt-4 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] opacity-50 mb-1">
                Skor Risiko
              </p>
              <p className="font-mono text-[30px] font-semibold leading-none tracking-tight">
                {primaryScore}
              </p>
            </div>
          </div>
          
          {/* Minimalist Progress Bar */}
          <div className="w-full h-1.5 bg-current/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-current rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${numericPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
