import { useState, useEffect, useRef } from "react";
import Navbar from "../components/common/Navbar";
import { useAnalytics, type RecentScan } from "../hooks/useAnalytics";
import LoadingOverlay from "../components/common/LoadingOverlay";
import {
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  MapPin,
  Building2,
  DollarSign,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  FileText,
  Image,
  Link,
  Activity,
} from "lucide-react";

/* ─── animated counter hook ─── */
function useCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(target);

  useEffect(() => {
    // Skip if target hasn't changed or is 0
    if (target === 0) {
      setCount(0);
      return;
    }
    // Skip if already at target (prevents StrictMode double-fire)
    if (target === prevTarget.current && count === target) return;
    prevTarget.current = target;

    const steps = 40;
    const inc = target / steps;
    let cur = 0;
    const id = setInterval(() => {
      cur += inc;
      if (cur >= target) {
        setCount(target);
        clearInterval(id);
      } else {
        setCount(Math.round(cur));
      }
    }, duration / steps);
    return () => clearInterval(id);
  }, [target, duration]);

  return count;
}

/* ─── stagger reveal wrapper ─── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        animation: `fadeInUp 0.5s ${delay}ms ease both`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── risk badge helper ─── */
function riskBadge(level: string) {
  const l = level?.toLowerCase();
  if (l === "low")
    return {
      label: "Aman",
      color: "text-risk-low bg-risk-low/10 border-risk-low/25",
      icon: <ShieldCheck className="w-3 h-3" />,
    };
  return {
    label: "Berisiko",
    color: "text-risk-high bg-risk-high/10 border-risk-high/25",
    icon: <ShieldAlert className="w-3 h-3" />,
  };
}

/* ─── input type icon ─── */
function inputIcon(type: string) {
  if (type === "image") return <Image className="w-3.5 h-3.5" />;
  if (type === "url") return <Link className="w-3.5 h-3.5" />;
  return <FileText className="w-3.5 h-3.5" />;
}

/* ─── relative time helper ─── */
function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export default function Analytics() {
  const { data, loading } = useAnalytics();

  if (loading) {
    return <LoadingOverlay />;
  }

  // Fallback values
  const totalScans = data?.total_scans ?? 0;
  const highRiskScans = data?.high_risk_scans ?? 0;
  const fraudRate = data?.fraud_rate ?? 0;

  const topCountries = data?.top_countries ?? [];
  const salaryStats = data?.salary_realistic_stats ?? {
    realistic: 0,
    unrealistic: 0,
    unknown: 0,
  };
  const recentScans: RecentScan[] = data?.recent_scans ?? [];

  return (
    <div className="min-h-screen bg-brand-deep flex flex-col pb-20 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full space-y-8">
        {/* ─── Header ─── */}
        <Reveal>
          <div className="text-center space-y-2">
            <span className="font-mono text-[10px] text-brand-green tracking-widest uppercase">
              Statistik Real-time
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-text-main">
              Dashboard Analitik Emigria
            </h1>
            <p className="font-sans text-xs text-text-sub/80 max-w-md mx-auto leading-relaxed">
              Ringkasan data pemindaian lowongan kerja luar negeri
            </p>
          </div>
        </Reveal>

        {/* ─── Hero Stats Grid ─── */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <StatCard
            delay={60}
            icon={<Activity className="w-4 h-4" />}
            label="Total Pemindaian"
            sublabel="Seluruh scan lowongan"
            value={totalScans}
            color="text-brand-green"
          />
          <StatCard
            delay={120}
            icon={<ShieldAlert className="w-4 h-4" />}
            label="Rasio Penipuan"
            sublabel={`${highRiskScans} terdeteksi berisiko`}
            percent={fraudRate}
            color="text-risk-high"
          />
        </div>

        {/* ─── Top Countries ─── */}
        {topCountries.length > 0 && (
          <Reveal delay={300}>
            <div className="bg-brand-surface border border-border-main rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-green" />
                <h3 className="font-display italic text-lg font-bold text-text-main">
                  Negara Tujuan Teratas
                </h3>
              </div>
              <div className="space-y-3">
                {topCountries.map((item, index) => {
                  const maxCount = topCountries[0]?.count ?? 1;
                  const pct = (item.count / maxCount) * 100;
                  return (
                    <div key={index} className="space-y-1.5">
                      <div className="flex justify-between font-sans text-xs font-medium text-text-main">
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-brand-deep border border-border-main flex items-center justify-center font-mono text-[9px] text-text-sub select-none">
                            {index + 1}
                          </span>
                          {item.country}
                        </span>
                        <span className="font-mono text-text-sub/60">
                          {item.count} scan
                        </span>
                      </div>
                      <div className="h-2 bg-brand-deep rounded-full overflow-hidden border border-border-main">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${pct}%`,
                            background:
                              "linear-gradient(90deg, var(--brand-green), var(--brand-green-dark))",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}

        {/* ─── Salary Realism Breakdown ─── */}
        <Reveal delay={360}>
          <div className="bg-brand-surface border border-border-main rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-brand-green" />
              <h3 className="font-display italic text-lg font-bold text-text-main">
                Realistis/Kewajaran Gaji
              </h3>
            </div>
            <SalaryDonut stats={salaryStats} total={totalScans} />
          </div>
        </Reveal>

        {/* ─── Recent Scans ─── */}
        {recentScans.length > 0 && (
          <Reveal delay={420}>
            <div className="bg-brand-surface border border-border-main rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-green" />
                <h3 className="font-display italic text-lg font-bold text-text-main">
                  Riwayat Scan Terbaru
                </h3>
              </div>
              <div className="space-y-3">
                {recentScans.map((scan, i) => (
                  <ScanRow key={scan.id} scan={scan} index={i} />
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════ */

/* ─── StatCard ─── */
function StatCard({
  icon,
  label,
  sublabel,
  value,
  percent,
  color,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  value?: number;
  percent?: number | null;
  color: string;
  delay?: number;
}) {
  const displayValue = useCounter(value ?? 0);
  const displayPct =
    percent != null ? Math.round(percent * 100) : null;
  const animPct = useCounter(displayPct ?? 0);

  return (
    <Reveal delay={delay}>
      <div className="bg-brand-surface border border-border-main rounded-2xl p-5 shadow-xl flex flex-col justify-center hover:border-brand-green/20 hover:shadow-2xl transition-all duration-300 group">
        <div className="flex items-center gap-2 mb-2">
          <span className={`${color} opacity-70 group-hover:opacity-100 transition-opacity`}>
            {icon}
          </span>
          <span className="font-sans text-[11px] text-text-sub select-none">
            {label}
          </span>
        </div>
        <span className={`font-mono text-2xl md:text-3xl font-bold ${color}`}>
          {value != null
            ? new Intl.NumberFormat("id-ID").format(displayValue)
            : `${animPct}%`}
        </span>
        <span className="font-sans text-[10px] text-text-sub/50 mt-1 select-none">
          {sublabel}
        </span>
      </div>
    </Reveal>
  );
}

/* ─── SalaryDonut (visual breakdown) ─── */
function SalaryDonut({
  stats,
  total,
}: {
  stats: { realistic: number; unrealistic: number; unknown: number };
  total: number;
}) {
  const safe = total || 1;
  const pctReal = Math.round((stats.realistic / safe) * 100);
  const pctUnreal = Math.round((stats.unrealistic / safe) * 100);
  const pctUnknown = 100 - pctReal - pctUnreal;

  const items = [
    {
      label: "Realistis",
      count: stats.realistic,
      pct: pctReal,
      color: "bg-risk-low",
      textColor: "text-risk-low",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    {
      label: "Tidak Realistis",
      count: stats.unrealistic,
      pct: pctUnreal,
      color: "bg-risk-high",
      textColor: "text-risk-high",
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
    {
      label: "Tidak Diketahui",
      count: stats.unknown,
      pct: pctUnknown,
      color: "bg-text-sub/30",
      textColor: "text-text-sub",
      icon: <HelpCircle className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stacked bar */}
      <div className="h-3 rounded-full overflow-hidden flex border border-border-main bg-brand-deep">
        {items.map((item, i) => (
          <div
            key={i}
            className={`${item.color} transition-all duration-1000 ease-out`}
            style={{ width: `${item.pct}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center gap-1 p-3 rounded-xl bg-brand-deep/60 border border-border-main"
          >
            <span className={`${item.textColor}`}>{item.icon}</span>
            <span className="font-mono text-lg font-bold text-text-main">
              {item.count}
            </span>
            <span className="font-sans text-[9px] text-text-sub/70 leading-tight">
              {item.label}
              <br />
              <span className={`font-mono font-semibold ${item.textColor}`}>
                {item.pct}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ScanRow ─── */
function ScanRow({ scan, index }: { scan: RecentScan; index: number }) {
  const badge = riskBadge(scan.risk_level);
  const pct =
    scan.final_risk_percentage != null
      ? Math.round(scan.final_risk_percentage)
      : null;

  return (
    <div
      className="bg-brand-deep/60 border border-border-main rounded-xl p-4 hover:border-brand-green/20 transition-all duration-200 group"
      style={{ animation: `fadeInUp 0.4s ${80 + index * 60}ms ease both` }}
    >
      {/* Top row: title + badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-text-sub/50">{inputIcon(scan.input_type)}</span>
            <h4 className="font-sans text-sm font-semibold text-text-main truncate">
              {scan.job_title || "Posisi tidak terdeteksi"}
            </h4>
          </div>
          {scan.company_name && (
            <div className="flex items-center gap-1 text-text-sub/70">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="font-sans text-[11px] truncate">
                {scan.company_name}
              </span>
            </div>
          )}
        </div>
        <span
          className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider border px-2 py-0.5 rounded-full whitespace-nowrap select-none ${badge.color}`}
        >
          {badge.icon}
          {badge.label}
        </span>
      </div>

      {/* Bottom row: metadata */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] md:text-[11px] text-text-sub/60 font-sans">
        {scan.country && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {scan.country}
          </span>
        )}
        {scan.salary && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span className="truncate max-w-[120px]">{scan.salary}</span>
          </span>
        )}
        {pct != null && (
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span className="font-mono font-semibold">{pct}%</span> risiko
          </span>
        )}
        {scan.salary_realistic != null && (
          <span className="flex items-center gap-1">
            {scan.salary_realistic ? (
              <CheckCircle2 className="w-3 h-3 text-risk-low" />
            ) : (
              <XCircle className="w-3 h-3 text-risk-high" />
            )}
            Gaji {scan.salary_realistic ? "wajar" : "tidak wajar"}
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Clock className="w-3 h-3" />
          {relativeTime(scan.created_at)}
        </span>
      </div>

      {/* Mini risk bar */}
      {pct != null && (
        <div className="mt-2.5 h-1 bg-border-main/30 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              pct >= 50 ? "bg-risk-high" : "bg-risk-low"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
