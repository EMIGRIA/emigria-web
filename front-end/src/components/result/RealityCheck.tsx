import { Banknote, X, Check } from "lucide-react";
import { formatIDR } from "../../lib/riskUtils";

interface RealityCheckData {
  offered_salary_idr: number | null;
  standard_min_idr: number | null;
  standard_max_idr: number | null;
  salary_is_realistic: boolean | null;
  flag: string | null;
}

interface RealityCheckProps {
  realityCheck: RealityCheckData;
}

export default function RealityCheck({ realityCheck }: RealityCheckProps) {
  const { offered_salary_idr, standard_min_idr, standard_max_idr, salary_is_realistic, flag } = realityCheck;

  return (
    <div id="gaji" className="bg-brand-surface rounded-2xl border border-border-main/80 dark:border-border-main/30 overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] hover:border-brand-green/30 transition-all duration-300 ease-out cursor-default">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-main/50">
        <div className="flex items-center gap-2">
          <Banknote className="w-3.5 h-3.5 text-text-sub" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.07em] text-text-sub">
            Kewajaran Gaji
          </span>
        </div>
        {salary_is_realistic !== null && (
          <div className={`flex items-center gap-1.5 font-sans text-[11px] font-semibold ${
            salary_is_realistic ? "text-risk-low" : "text-risk-high"
          }`}>
            {salary_is_realistic
              ? <><Check className="w-3.5 h-3.5" /><span>Wajar</span></>
              : <><X className="w-3.5 h-3.5" /><span>Tidak Wajar</span></>
            }
          </div>
        )}
      </div>

      {offered_salary_idr == null ? (
        <div className="px-6 py-5">
          <p className="font-sans text-sm text-text-sub/50">Data gaji tidak tersedia dari lowongan ini.</p>
        </div>
      ) : (
        <>
          <div className="px-6 py-5 space-y-4">
            {/* Offered salary — heading-2 scale, Source Code Pro for the number */}
            <div>
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-text-sub/50 mb-1.5">
                Gaji Ditawarkan
              </p>
              <p className="font-mono text-2xl md:text-[28px] font-semibold text-text-main leading-none tracking-tight">
                {formatIDR(offered_salary_idr)}
              </p>
            </div>

            {/* Standard range */}
            {standard_min_idr != null && standard_max_idr != null && (
              <div>
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-text-sub/50 mb-1.5">
                  Standar Gaji Negara Terkait
                </p>
                <p className="font-mono text-sm font-medium text-text-sub">
                  {standard_min_idr === standard_max_idr
                    ? formatIDR(standard_min_idr)
                    : `${formatIDR(standard_min_idr)} – ${formatIDR(standard_max_idr)}`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Flag note — body-sm */}
          {flag && (
            <div className="px-6 py-4 border-t border-border-main/50 bg-brand-deep/20">
              <p className="font-sans text-sm text-text-sub leading-[1.5]">{flag}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
