export const getRiskColor = (level?: string | null): string => {
  if (!level) return "text-text-muted bg-brand-surface border-border-main";
  const map: Record<string, string> = {
    low:      "text-risk-low bg-risk-low/10 border-risk-low/30",
    high:     "text-risk-high bg-risk-high/10 border-risk-high/30",
    critical: "text-risk-high bg-risk-high/10 border-risk-high/30",
  };
  return map[level.toLowerCase()] ?? "text-text-muted bg-brand-surface border-border-main";
};

export const getRiskLabel = (level?: string | null): string => {
  if (!level) return "Tidak Diketahui";
  const map: Record<string, string> = {
    low:      "Risiko Rendah",
    high:     "Risiko Tinggi",
    critical: "Risiko Tinggi",
  };
  return map[level.toLowerCase()] ?? "Tidak Diketahui";
};

export const getRiskIcon = (level?: string | null): string => {
  if (!level) return "?";
  const map: Record<string, string> = {
    low:      "OK",
    high:     "!!",
    critical: "!!",
  };
  return map[level.toLowerCase()] ?? "?";
};

export const formatIDR = (amount?: number | null): string | null => {
  return amount != null
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(amount)
    : null;
};

export const formatPct = (prob?: number | null): string | null => {
  return prob != null ? `${Math.round(prob * 100)}%` : null;
};

// Format a percentage value already in 0-100 range (from FastAPI hybrid response)
export const formatPctDirect = (pct?: number | null): string | null => {
   return pct != null ? `${Math.round(pct * 10) / 10}%` : null;
};

// Map triggered_rules internal codes to Indonesian labels
export const formatTriggeredRule = (rule: string): string => {
  const map: Record<string, string> = {
    no_company_logo: 'Tidak ada logo perusahaan',
    no_screening_questions: 'Tidak ada pertanyaan/screening',
  };
  // Remove legit_signal_count entries from display
  if (rule.startsWith('legit_signal_count')) return '';
  return map[rule] ?? rule.replace(/_/g, ' ');
};
