import { getRiskColor, getRiskLabel, formatPct } from "../../lib/riskUtils";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface VerdictCardProps {
  verdict: {
    risk_level: string;
    ml_fraud_probability: number | null;
    pmi_rule_score?: number | null;
  };
  summaryText: string;
}

export default function VerdictCard({ verdict, summaryText }: VerdictCardProps) {
  const { risk_level, ml_fraud_probability } = verdict;
  const colorClass = getRiskColor(risk_level);
  const label = getRiskLabel(risk_level);

  const Icon = () => {
    const l = risk_level?.toLowerCase();
    if (l === "low")                      return <CheckCircle2 className="w-4 h-4 text-risk-low" />;
    if (l === "medium")                   return <AlertTriangle className="w-4 h-4 text-risk-medium" />;
    if (l === "high" || l === "critical") return <XCircle className="w-4 h-4 text-risk-high" />;
    return <AlertTriangle className="w-4 h-4 text-text-muted" />;
  };

  return (
    <div id="ringkasan" className={`rounded-xl border p-5 animate-[fadeInUp_0.4s_ease_both] ${colorClass}`}>
      {/* Risk label — micro-uppercase style from MONGODESIGN */}
      <div className="flex items-center gap-2 mb-3">
        <Icon />
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em]">
          {label}
        </span>
      </div>

      {/* Summary — heading-4 from MONGODESIGN (22px, weight 500) */}
      <p className="font-sans text-xl md:text-[22px] font-medium leading-[1.35] mb-4 tracking-[-0.02em]">
        {summaryText}
      </p>

      {/* Stats — Source Code Pro for numbers */}
      {ml_fraud_probability != null && (
        <div className="flex items-center gap-6 border-t border-current/10 pt-4">
          <div>
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] opacity-50 mb-1">
              Fraud Score
            </p>
            <p className="font-mono text-[28px] font-semibold leading-none tracking-tight">
              {formatPct(ml_fraud_probability)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
