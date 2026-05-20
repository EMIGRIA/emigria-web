export const getRiskColor = (level?: string | null): string => {
  if (!level) return "text-text-muted bg-brand-surface border-border-main";
  const map: Record<string, string> = {
    low:      "text-risk-low bg-risk-low/10 border-risk-low/30",
    medium:   "text-risk-medium bg-risk-medium/10 border-risk-medium/30",
    high:     "text-risk-high bg-risk-high/10 border-risk-high/30",
    critical: "text-risk-high bg-risk-high/10 border-risk-high/30",
  };
  return map[level.toLowerCase()] ?? "text-text-muted bg-brand-surface border-border-main";
};

export const getRiskLabel = (level?: string | null): string => {
  if (!level) return "Tidak Diketahui";
  const map: Record<string, string> = {
    low:      "Risiko Rendah",
    medium:   "Risiko Sedang",
    high:     "Risiko Tinggi",
    critical: "Risiko Tinggi",
  };
  return map[level.toLowerCase()] ?? "Tidak Diketahui";
};

export const getRiskIcon = (level?: string | null): string => {
  if (!level) return "?";
  const map: Record<string, string> = {
    low:      "OK",
    medium:   "!",
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
