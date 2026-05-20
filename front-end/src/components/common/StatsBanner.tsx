import { useAnalytics } from "../../hooks/useAnalytics";
import { Search, ShieldAlert } from "lucide-react";

export default function StatsBanner() {
  const { data } = useAnalytics();

  const total = data?.total_scans ?? 1245;
  const rate = data?.fraud_rate != null ? Math.round(data.fraud_rate * 100) : 38;

  // Localized total scans number formatting
  const formattedTotal = new Intl.NumberFormat("id-ID").format(total);

  return (
    <div className="font-mono text-xs text-text-sub/70 flex items-center justify-center gap-1.5 select-none tracking-wider py-2">
      <Search className="w-3.5 h-3.5 text-text-sub/60" />
      <span>{formattedTotal} dianalisis</span>
      <span className="mx-2 text-text-sub/20">|</span>
      <ShieldAlert className="w-3.5 h-3.5 text-text-sub/60" />
      <span>{rate}% penipuan</span>
    </div>
  );
}
