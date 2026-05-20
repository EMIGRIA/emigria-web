import { ShieldAlert, X, Check, Minus } from "lucide-react";

interface RiskSignals {
  mentions_tourist_visa: boolean;
  mentions_pilgrimage_visa: boolean;
  asks_for_passport: boolean;
  asks_upfront_payment: boolean;
  promises_fast_process: boolean;
  promises_high_salary: boolean;
  uses_personal_contact: boolean;
  company_identity_clear: boolean;
  salary_claim_unrealistic: boolean;
  urgency_level: "low" | "medium" | "high";
  risk_keywords: string[];
}

interface RiskSignalListProps {
  signals: RiskSignals;
}

type SignalEntry = {
  key: keyof Omit<RiskSignals, "urgency_level" | "risk_keywords">;
  label: string;
  danger: boolean;
};

const SIGNALS: SignalEntry[] = [
  { key: "asks_upfront_payment",      label: "Minta Bayaran di Muka",          danger: true },
  { key: "mentions_tourist_visa",     label: "Pakai Visa Turis",               danger: true },
  { key: "mentions_pilgrimage_visa",  label: "Pakai Visa Umroh/Haji",          danger: true },
  { key: "asks_for_passport",         label: "Minta Paspor Langsung",          danger: true },
  { key: "promises_fast_process",     label: "Proses Dijanjikan Cepat",        danger: true },
  { key: "salary_claim_unrealistic",  label: "Klaim Gaji Tidak Masuk Akal",    danger: true },
  { key: "promises_high_salary",      label: "Gaji Dijanjikan Sangat Tinggi",  danger: true },
  { key: "uses_personal_contact",     label: "Kontak Personal (WA/HP)",        danger: true },
  { key: "company_identity_clear",    label: "Identitas Perusahaan Jelas",     danger: false },
];

const URGENCY: Record<string, { label: string; color: string }> = {
  low:    { label: "Rendah", color: "text-risk-low" },
  medium: { label: "Sedang", color: "text-risk-medium" },
  high:   { label: "Tinggi", color: "text-risk-high" },
};

export default function RiskSignalList({ signals }: RiskSignalListProps) {
  const { urgency_level, risk_keywords } = signals;
  const urgency = URGENCY[urgency_level?.toLowerCase()] ?? { label: "—", color: "text-text-sub" };

  return (
    <div id="sinyal" className="bg-brand-surface rounded-xl border border-border-main overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-main">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-text-sub" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.07em] text-text-sub">
            Sinyal Risiko
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-[11px] text-text-sub/40">Urgensi</span>
          <span className={`font-sans text-[11px] font-semibold ${urgency.color}`}>
            {urgency.label}
          </span>
        </div>
      </div>

      {/* Signal rows — body-sm with dividers (comparison-row pattern) */}
      <div className="divide-y divide-border-main">
        {SIGNALS.map((item) => {
          const val = signals[item.key] as boolean;
          const isAlert = item.danger && val;
          const isGood  = !item.danger && val;

          return (
            <div key={item.key} className="flex items-center justify-between px-5 py-2.5">
              <span className={`font-sans text-sm leading-[1.5] ${
                isAlert ? "text-text-main" :
                isGood  ? "text-text-main" :
                "text-text-sub/35"
              }`}>
                {item.label}
              </span>
              <div className="shrink-0 ml-4">
                {isAlert ? (
                  <X className="w-3.5 h-3.5 text-risk-high" />
                ) : isGood ? (
                  <Check className="w-3.5 h-3.5 text-risk-low" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-text-sub/20" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Keywords */}
      {risk_keywords && risk_keywords.length > 0 && (
        <div className="px-5 py-3.5 border-t border-border-main flex flex-wrap gap-1.5">
          {risk_keywords.map((kw, i) => (
            <span
              key={i}
              className="font-mono text-[11px] px-2 py-0.5 rounded-sm bg-risk-medium/10 text-risk-medium border border-risk-medium/20"
            >
              #{kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
