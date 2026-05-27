import { Briefcase, ExternalLink, ShieldCheck, ClipboardCheck, X } from "lucide-react";

interface GeoRisk {
  country: string | null;
  iso3?: string | null;
}

interface OfficialDataCardProps {
  geoRisks?: GeoRisk[];
  onClose?: () => void;
}

export default function OfficialDataCard({ onClose }: OfficialDataCardProps) {
  const totalJobsDisplay = "10.000+";
  const jobsLabel = "VERIFIED JOBS AVAILABLE";
  
  const opportunities = [
    {
      title: "General Worker",
      subtitle: "Malaysia • 360 Openings",
    },
    {
      title: "Domestic Worker",
      subtitle: "Singapura • 80 Openings",
    },
    {
      title: "Agriculture Laborers",
      subtitle: "Brunei • 30 Openings",
    },
  ];

  const handleRedirect = () => {
    window.open("https://siskop2mi.bp2mi.go.id/lowongan/list", "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleRedirect}
      className="relative overflow-hidden rounded-2xl bg-brand-surface border border-border-main p-6 md:p-7 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 ease-out cursor-pointer group text-text-main select-none"
    >
      {/* Decorative Watermark Icon */}
      <div className="absolute top-4 right-4 text-brand-green/5 dark:text-brand-green/5 group-hover:text-brand-green/10 group-hover:scale-110 transition-all duration-500 ease-out pointer-events-none">
        <ClipboardCheck className="w-20 h-20" />
      </div>

      {/* Header Info */}
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <div className="flex items-center gap-1.5 bg-brand-green/10 dark:bg-brand-green/15 border border-brand-green/20 px-2.5 py-1 rounded-full text-brand-green">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.08em]">
            Official Data
          </span>
        </div>
        
        {onClose ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="ml-auto p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-brand-deep/30 transition-all cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <span className="ml-auto font-sans text-[10px] text-text-sub/50 group-hover:text-text-sub/70 flex items-center gap-1 transition-colors">
            Buka Portal <ExternalLink className="w-3 h-3" />
          </span>
        )}
      </div>

      <p className="font-sans text-xs text-text-sub/60 leading-none mb-4 relative z-10">
        Sumber: SISKOP2MI BP2MI
      </p>

      {/* Main Stat */}
      <div className="mb-6 relative z-10">
        <h3 className="font-mono text-5xl font-extrabold leading-none tracking-tight text-text-main mb-2">
          {totalJobsDisplay}
        </h3>
        <p className="font-sans text-[10px] font-bold tracking-wider uppercase text-text-sub/75">
          {jobsLabel}
        </p>
      </div>

      {/* Top Opportunities */}
      <div className="space-y-3 relative z-10">
        <h4 className="font-sans text-xs font-semibold text-text-main uppercase tracking-wider mb-1">
          Top Opportunities:
        </h4>

        <div className="grid gap-2">
          {opportunities.map((opp, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl bg-brand-deep/30 border border-border-main/40 p-3.5"
            >
              <div className="space-y-0.5">
                <p className="font-sans text-sm font-bold text-text-main leading-snug">
                  {opp.title}
                </p>
                <p className="font-sans text-xs text-text-sub/70">
                  {opp.subtitle}
                </p>
              </div>
              <Briefcase className="w-3.5 h-3.5 text-text-muted/30 shrink-0 ml-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="mt-6 relative z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRedirect();
          }}
          className="w-full bg-brand-green text-white dark:bg-brand-green dark:text-brand-deep hover:bg-brand-green/90 font-sans text-xs font-bold py-3.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md active:scale-[0.98] select-none"
        >
          <span>Lihat Semua Lowongan</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
