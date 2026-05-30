import { useState, useEffect, useRef } from "react";
import Navbar from "../components/common/Navbar";
import { useAnalytics, type RecentScan } from "../hooks/useAnalytics";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 5;

/* ─── animated counter hook ─── */
function useCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(target);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    if (target === prevTarget.current && count === target) return;
    prevTarget.current = target;

    const steps = 40;
    const inc = target / steps;
    let cur = 0;
    const id = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.round(cur));
    }, duration / steps);
    return () => clearInterval(id);
  }, [target, duration]);

  return count;
}

/* ─── risk badge helper ─── */
function riskBadge(level: string) {
  const l = level?.toLowerCase();
  if (l === "low") return {
    label: "Aman",
    dot: "bg-risk-low",
    text: "text-risk-low",
    bg: "bg-risk-low/8 border-risk-low/20",
    icon: <ShieldCheck className="w-3 h-3" />,
  };
  return {
    label: "Berisiko",
    dot: "bg-risk-high",
    text: "text-risk-high",
    bg: "bg-risk-high/8 border-risk-high/20",
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
  if (mins < 60) return `${mins} mnt lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

/* ═══════════════════════════ PAGE ═══════════════════════════ */
export default function Analytics() {
  const { data, loading } = useAnalytics();
  const [page, setPage] = useState(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-deep flex flex-col justify-center items-center gap-4">
        <div className="w-8 h-8 border-[1.5px] border-brand-green border-t-transparent rounded-full animate-spin" />
        <p className="font-sans text-xs text-text-sub tracking-widest uppercase">Memuat data…</p>
      </div>
    );
  }

  const totalScans   = data?.total_scans ?? 0;
  const highRisk     = data?.high_risk_scans ?? 0;
  const fraudRate    = data?.fraud_rate ?? 0;
  const topCountries = data?.top_countries ?? [];
  const salaryStats  = data?.salary_realistic_stats ?? { realistic: 0, unrealistic: 0, unknown: 0 };
  const recentScans: RecentScan[] = data?.recent_scans ?? [];

  const totalPages   = Math.max(1, Math.ceil(recentScans.length / ITEMS_PER_PAGE));
  const paginated    = recentScans.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const goTo = (n: number) => setPage(Math.min(Math.max(1, n), totalPages));

  return (
    <div className="min-h-screen bg-brand-deep flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 px-4 py-10 max-w-4xl mx-auto w-full space-y-10 pb-20">

        {/* ── Header ── */}
        <div className="space-y-1" style={{ animation: "fadeInUp 0.5s ease both" }}>
          <p className="font-sans text-[11px] font-medium tracking-[0.12em] uppercase text-brand-green">
            Statistik Real-time
          </p>
          <h1 className="font-sans text-2xl md:text-3xl font-semibold text-text-main tracking-tight">
            Analitik Emigria
          </h1>
          <p className="font-sans text-sm text-text-sub/70">
            Ringkasan data dari berbagai pemindaian pengguna.
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 gap-3" style={{ animation: "fadeInUp 0.5s 80ms ease both" }}>
          <StatCard
            icon={<Activity className="w-4 h-4" />}
            label="Total Pemindaian"
            sub="Seluruh scan lowongan"
            value={totalScans}
            accent="text-brand-green"
          />
          <StatCard
            icon={<ShieldAlert className="w-4 h-4" />}
            label="Rasio Penipuan"
            sub={`${highRisk} terdeteksi berisiko`}
            percent={fraudRate}
            accent="text-risk-high"
          />
        </div>

        {/* ── Two-column grid (countries + salary) ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          style={{ animation: "fadeInUp 0.5s 160ms ease both" }}
        >
          {/* Top Countries */}
          {topCountries.length > 0 && (
            <Section icon={<MapPin className="w-4 h-4" />} title="Negara Tujuan Teratas">
              <div className="space-y-3">
                {topCountries.map((item, i) => {
                  const max = topCountries[0]?.count ?? 1;
                  const pct = (item.count / max) * 100;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 font-sans text-xs text-text-main">
                          <span className="w-4 h-4 rounded-full bg-brand-deep border border-border-main flex items-center justify-center font-mono text-[9px] text-text-sub shrink-0">
                            {i + 1}
                          </span>
                          {item.country}
                        </span>
                        <span className="font-mono text-[10px] text-text-sub/50">{item.count}×</span>
                      </div>
                      <div className="h-1 bg-brand-deep rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${pct}%`, background: "var(--brand-green)" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Salary Breakdown */}
          <Section icon={<DollarSign className="w-4 h-4" />} title="Kewajaran Gaji">
            <SalaryBreakdown stats={salaryStats} total={totalScans} />
          </Section>
        </div>

        {/* ── Recent Scans with Pagination ── */}
        {recentScans.length > 0 && (
          <div style={{ animation: "fadeInUp 0.5s 240ms ease both" }}>
            <Section
              icon={<Clock className="w-4 h-4" />}
              title="Riwayat Scan Terbaru"
              headerRight={
                recentScans.length > ITEMS_PER_PAGE ? (
                  <span className="font-sans text-[11px] text-text-sub/50">
                    {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, recentScans.length)} dari {recentScans.length}
                  </span>
                ) : null
              }
            >
              {/* Rows */}
              <div className="space-y-2">
                {paginated.map((scan, i) => (
                  <ScanRow key={scan.id} scan={scan} index={i} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border-main/40 mt-4">
                  <button
                    onClick={() => goTo(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 font-sans text-xs font-medium text-text-sub hover:text-text-main disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-brand-deep cursor-pointer select-none"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Sebelumnya
                  </button>

                  {/* Page dots */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => goTo(n)}
                        className={`w-7 h-7 rounded-lg font-sans text-[11px] font-medium transition-all duration-200 cursor-pointer select-none ${
                          n === page
                            ? "bg-brand-green text-white shadow-sm"
                            : "text-text-sub hover:text-text-main hover:bg-brand-deep"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => goTo(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 font-sans text-xs font-medium text-text-sub hover:text-text-main disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-brand-deep cursor-pointer select-none"
                  >
                    Berikutnya
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </Section>
          </div>
        )}
      </main>
    </div>
  );
}

/* ═══════════════════════════ SUB-COMPONENTS ═══════════════════════════ */

/* ── Section wrapper ── */
function Section({
  icon,
  title,
  children,
  headerRight,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}) {
  return (
    <div className="bg-brand-surface border border-border-main rounded-2xl p-5 space-y-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-brand-green">{icon}</span>
          <h3 className="font-sans text-sm font-semibold text-text-main tracking-tight">{title}</h3>
        </div>
        {headerRight}
      </div>
      {children}
    </div>
  );
}

/* ── StatCard ── */
function StatCard({
  icon,
  label,
  sub,
  value,
  percent,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  value?: number;
  percent?: number | null;
  accent: string;
}) {
  const displayValue = useCounter(value ?? 0);
  const displayPct   = percent != null ? Math.round(percent * 100) : null;
  const animPct      = useCounter(displayPct ?? 0);

  return (
    <div className="bg-brand-surface border border-border-main rounded-2xl p-5 flex flex-col gap-3 hover:border-brand-green/20 transition-all duration-300">
      <div className="flex items-center gap-2">
        <span className={`${accent} opacity-80`}>{icon}</span>
        <span className="font-sans text-[11px] text-text-sub font-medium">{label}</span>
      </div>
      <div>
        <p className={`font-mono text-3xl font-bold tracking-tight ${accent}`}>
          {value != null
            ? new Intl.NumberFormat("id-ID").format(displayValue)
            : `${animPct}%`}
        </p>
        <p className="font-sans text-[10px] text-text-sub/50 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

/* ── SalaryBreakdown ── */
function SalaryBreakdown({
  stats,
  total,
}: {
  stats: { realistic: number; unrealistic: number; unknown: number };
  total: number;
}) {
  const safe = total || 1;
  const pctReal   = Math.round((stats.realistic   / safe) * 100);
  const pctUnreal = Math.round((stats.unrealistic / safe) * 100);
  const pctUnknown = 100 - pctReal - pctUnreal;

  const items = [
    { label: "Wajar",          count: stats.realistic,   pct: pctReal,    bar: "bg-risk-low",     text: "text-risk-low",  icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { label: "Tidak Wajar",    count: stats.unrealistic, pct: pctUnreal,  bar: "bg-risk-high",    text: "text-risk-high", icon: <XCircle className="w-3.5 h-3.5" /> },
    { label: "Tidak Diketahui",count: stats.unknown,     pct: pctUnknown, bar: "bg-border-main",  text: "text-text-sub",  icon: <HelpCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-4">
      {/* Stacked bar */}
      <div className="h-1.5 rounded-full overflow-hidden flex bg-brand-deep">
        {items.map((it, i) => (
          <div key={i} className={`${it.bar} transition-all duration-1000 ease-out`} style={{ width: `${it.pct}%` }} />
        ))}
      </div>

      {/* Legend rows */}
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className={`flex items-center gap-2 font-sans text-xs ${it.text}`}>
              {it.icon}
              {it.label}
            </span>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-text-sub/60">{it.count}</span>
              <span className={`font-semibold ${it.text}`}>{it.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ScanRow ── */
function ScanRow({ scan, index }: { scan: RecentScan; index: number }) {
  const badge = riskBadge(scan.risk_level);
  const pct   = scan.final_risk_percentage != null ? Math.round(scan.final_risk_percentage) : null;

  return (
    <div
      className="group flex flex-col gap-2 px-4 py-3.5 rounded-xl border border-border-main/60 hover:border-brand-green/20 bg-brand-deep/40 hover:bg-brand-deep/70 transition-all duration-200"
      style={{ animation: `fadeInUp 0.35s ${index * 50}ms ease both` }}
    >
      {/* Row top */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-text-sub/40 shrink-0">{inputIcon(scan.input_type)}</span>
            <p className="font-sans text-sm font-medium text-text-main truncate leading-snug">
              {scan.job_title || "Posisi tidak terdeteksi"}
            </p>
          </div>
          {scan.company_name && (
            <p className="flex items-center gap-1 font-sans text-[11px] text-text-sub/60 mt-0.5 ml-5">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{scan.company_name}</span>
            </p>
          )}
        </div>

        {/* Badge */}
        <span className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider border px-2 py-0.5 rounded-full whitespace-nowrap select-none ${badge.bg} ${badge.text}`}>
          {badge.icon}
          {badge.label}
        </span>
      </div>

      {/* Row bottom: meta */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 font-sans text-[10px] text-text-sub/50">
        {scan.country && (
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{scan.country}</span>
        )}
        {scan.salary && (
          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /><span className="truncate max-w-[100px]">{scan.salary}</span></span>
        )}
        {pct != null && (
          <span className={`flex items-center gap-1 font-mono font-semibold ${pct >= 50 ? "text-risk-high" : "text-risk-low"}`}>
            <TrendingUp className="w-3 h-3" />{pct}% risiko
          </span>
        )}
        {scan.salary_realistic != null && (
          <span className="flex items-center gap-1">
            {scan.salary_realistic ? <CheckCircle2 className="w-3 h-3 text-risk-low" /> : <XCircle className="w-3 h-3 text-risk-high" />}
            Gaji {scan.salary_realistic ? "wajar" : "tidak wajar"}
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" />{relativeTime(scan.created_at)}</span>
      </div>

      {/* Risk bar */}
      {pct != null && (
        <div className="h-[2px] bg-border-main/20 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${pct >= 50 ? "bg-risk-high" : "bg-risk-low"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
