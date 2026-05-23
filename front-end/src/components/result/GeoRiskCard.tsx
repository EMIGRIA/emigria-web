import { useState, useRef, useCallback } from "react";
import { MapPin, TrendingUp, TrendingDown, Minus, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
import { getRiskLabel } from "../../lib/riskUtils";
import CountryMapVisual from "./CountryMapVisual";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-brand-surface border border-border-main p-2.5 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-150">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">
          Tahun {payload[0].payload.year}
        </p>
        <p className="font-mono text-xs font-bold text-text-main leading-none">
          Crime Index: <span className="text-sm font-semibold">{value.toFixed(2)}</span>
        </p>
      </div>
    );
  }
  return null;
}

interface CrimeRanking {
  rank: number | null;
  total: number | null;
}

interface CrimeRankings {
  region?: CrimeRanking;
  global?: CrimeRanking;
}

interface CrimeHistoricalEntry {
  year: number;
  crime_index: number;
}

interface GeoRisk {
  country: string | null;
  iso3: string | null;
  year: number | null;
  data_available: boolean;
  risk_level: string | null;
  risk_score: number | null;
  crime_index: number | null;
  crime_level: string | null;
  crime_variation: number | null;
  crime_rankings: CrimeRankings | null;
  crime_historical: CrimeHistoricalEntry[] | null;
  source_note: string | null;
}

interface GeoRiskCardProps {
  geoRisks: GeoRisk[];
}

const RISK_COLOR: Record<string, string> = {
  low:      "text-risk-low",
  medium:   "text-risk-medium",
  high:     "text-risk-high",
  critical: "text-risk-high",
};

const CRIME_LEVEL_BG: Record<string, string> = {
  low:    "bg-risk-low/10 border-risk-low/30 text-risk-low",
  medium: "bg-risk-medium/10 border-risk-medium/30 text-risk-medium",
  high:   "bg-risk-high/10 border-risk-high/30 text-risk-high",
};

function VariationBadge({ variation }: { variation: number | null }) {
  if (variation === null) return <span className="font-mono text-xs text-text-sub/40">—</span>;
  const isUp   = variation > 0;
  const isDown = variation < 0;
  const color  = isUp ? "text-risk-high" : isDown ? "text-risk-low" : "text-text-sub/50";
  const Icon   = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const label  = `${isUp ? "+" : ""}${variation.toFixed(2)}`;
  return (
    <span className={`flex items-center gap-0.5 font-mono text-[11px] font-semibold ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

/* ───────────── Single Country Slide ───────────── */
function CountrySlide({ geoRisk }: { geoRisk: GeoRisk }) {
  const {
    country,
    iso3,
    year,
    risk_level,
    crime_index,
    crime_level,
    crime_variation,
    crime_rankings,
    crime_historical,
    source_note,
  } = geoRisk;

  const levelKey = (crime_level ?? risk_level ?? "").toLowerCase();

  if (!country) {
    return (
      <div className="px-5 py-6 flex flex-col items-center justify-center text-center gap-2">
        <ShieldAlert className="w-8 h-8 text-text-muted opacity-30" />
        <p className="font-sans text-sm text-text-sub/50">Negara tujuan tidak terdeteksi dari lowongan ini.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header Section (Country Name + ISO + Year) */}
      <div className="flex flex-col gap-1">
        <p className="font-sans text-[26px] font-medium leading-none tracking-[-0.03em] text-text-main mb-0.5">
          {country}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {iso3 && (
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-sub/40 bg-brand-deep/30 px-1.5 py-0.5 rounded">
              {iso3}
            </span>
          )}
          {year && (
            <span className="font-mono text-[10px] text-text-sub/40">
              Data {year}
            </span>
          )}
        </div>
      </div>

      {/* Main Layout Grid: Live Map and Metrics side-by-side with exact equal heights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch shrink-0 lg:mb-3">

        {/* Left Column: Live Map (exact height 220px) */}
        <div className="h-[220px]">
          <CountryMapVisual countryName={country} riskLevel={risk_level ?? "medium"} />
        </div>

        {/* Right Column: Metrics (exact height 220px, flex column to space elements perfectly) */}
        <div className="flex flex-col gap-3 h-[220px] justify-between">

          {/* Row 1: Crime Index + Tingkat (equal heights) */}
          <div className="grid grid-cols-2 gap-3 h-[100px]">
            {/* Crime Index Card */}
            <div className="bg-brand-deep/30 dark:bg-brand-deep/10 rounded-xl p-4 border border-border-main/60 dark:border-border-main/20 flex flex-col justify-between shadow-xs hover:border-brand-green/30 dark:hover:border-brand-green/40 hover:scale-[1.02] hover:bg-brand-deep/45 transition-all duration-300">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-text-sub/50">
                Crime Index
              </p>
              <p className="font-mono text-xl font-bold text-text-main leading-none my-1">
                {crime_index != null ? crime_index.toFixed(2) : "N/A"}
              </p>
              <p className="font-mono text-[9px] text-text-sub/30">skala 0–10</p>
            </div>

            {/* Tingkat Card */}
            <div className="bg-brand-deep/30 dark:bg-brand-deep/10 rounded-xl p-4 border border-border-main/60 dark:border-border-main/20 flex flex-col justify-between shadow-xs hover:border-brand-green/30 dark:hover:border-brand-green/40 hover:scale-[1.02] hover:bg-brand-deep/45 transition-all duration-300">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-text-sub/50">
                Tingkat
              </p>
              {crime_level ? (
                <span className={`inline-block my-1 px-2.5 py-1 rounded border text-[11px] font-semibold uppercase tracking-widest w-fit ${CRIME_LEVEL_BG[levelKey] ?? "text-text-sub border-border-main"}`}>
                  {crime_level}
                </span>
              ) : (
                <p className="font-mono text-xl font-bold text-text-main my-1 leading-none">N/A</p>
              )}
              <div /> {/* Bottom spacer for layout alignment */}
            </div>
          </div>

          {/* Row 2: Redesigned Crime Rankings Card */}
          {crime_rankings && (
            <div className="bg-brand-deep/30 dark:bg-brand-deep/10 rounded-xl p-4 border border-border-main/60 dark:border-border-main/20 flex-1 flex flex-col justify-between shadow-xs hover:border-brand-green/30 dark:hover:border-brand-green/40 hover:scale-[1.02] hover:bg-brand-deep/45 transition-all duration-300">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-text-sub/50">
                Peringkat Kriminalitas
              </p>
              
              <div className="grid grid-cols-2 gap-4 items-center my-auto">
                
                {/* Regional Rank */}
                {crime_rankings.region && crime_rankings.region.rank != null && (
                  <div className="flex flex-col gap-1 border-r border-border-main/30 pr-2">
                    <span className="font-sans text-[9px] font-semibold text-text-sub/50 uppercase tracking-wider leading-none">
                      Regional
                    </span>
                    <div className="font-mono text-[20px] font-extrabold text-text-main leading-none tracking-tight mt-0.5">
                      #{crime_rankings.region.rank}
                      <span className="text-text-sub/30 font-medium text-sm">/{crime_rankings.region.total}</span>
                    </div>
                  </div>
                )}

                {/* Global Rank */}
                {crime_rankings.global && crime_rankings.global.rank != null && (
                  <div className="flex flex-col gap-1 pl-2">
                    <span className="font-sans text-[9px] font-semibold text-text-sub/50 uppercase tracking-wider leading-none">
                      Global
                    </span>
                    <div className="font-mono text-[20px] font-extrabold text-text-main leading-none tracking-tight mt-0.5">
                      #{crime_rankings.global.rank}
                      <span className="text-text-sub/30 font-medium text-sm">/{crime_rankings.global.total}</span>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Historical Trend */}
      {crime_historical && crime_historical.length > 0 && (() => {
        const chartData = [...crime_historical].sort((a, b) => a.year - b.year);
        const indices = chartData.map(e => e.crime_index);
        const minCrime = Math.min(...indices);
        const maxCrime = Math.max(...indices);
        const range = maxCrime - minCrime;
        // Pad domain so the line doesn't hug the edges
        const yMin = Math.max(0, parseFloat((minCrime - (range > 0 ? range * 0.5 : 0.3)).toFixed(2)));
        const yMax = Math.min(10, parseFloat((maxCrime + (range > 0 ? range * 0.5 : 0.3)).toFixed(2)));
        
        const strokeColor = levelKey === "low" 
          ? "var(--risk-low)" 
          : levelKey === "medium" 
            ? "var(--risk-medium)" 
            : "var(--risk-high)";

        // Unique gradient ID per country to avoid SVG conflicts
        const gradientId = `crimeGrad-${(country || "unknown").replace(/\s+/g, "-")}`;

        return (
          <div className="bg-brand-deep/30 dark:bg-brand-deep/10 rounded-xl p-5 border border-border-main/60 dark:border-border-main/20 shadow-xs hover:border-brand-green/30 dark:hover:border-brand-green/40 hover:scale-[1.01] hover:bg-brand-deep/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-text-sub/50">
                Tren Crime Index
              </p>
              <VariationBadge variation={crime_variation} />
            </div>
            <div className="h-[160px] w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" strokeOpacity={0.2} />
                  <XAxis
                    dataKey="year"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }}
                    dy={8}
                    interval={0}
                  />
                  <YAxis
                    hide
                    domain={[yMin, yMax]}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: "4 4" }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="crime_index"
                    stroke={strokeColor}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#${gradientId})`}
                    dot={{ r: 4, fill: strokeColor, stroke: "var(--bg-surface)", strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--bg-surface)" }}
                    label={(props: any) => {
                      const { x, y, value } = props;
                      if (x === undefined || y === undefined || value === undefined) return null;
                      return (
                        <text
                          x={x}
                          y={y - 10}
                          fill="var(--text-secondary)"
                          fontSize={10}
                          fontFamily="var(--font-mono)"
                          fontWeight={600}
                          textAnchor="middle"
                        >
                          {Number(value).toFixed(2)}
                        </text>
                      );
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })()}

      {/* Source note (Taiwan proxy data disclaimer) */}
      {source_note && (
        <p className="font-sans text-[10px] text-text-sub/35 leading-[1.5] border-t border-border-main/30 pt-2">
          ⚠ {source_note}
        </p>
      )}
    </div>
  );
}

/* ───────────── Main GeoRiskCard (Carousel wrapper) ───────────── */
export default function GeoRiskCard({ geoRisks }: GeoRiskCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const isMulti = geoRisks.length > 1;
  const activeGeo = geoRisks[activeIndex] || geoRisks[0];
  const activeRiskLevel = activeGeo?.risk_level;

  const goTo = useCallback((idx: number) => {
    setActiveIndex(Math.max(0, Math.min(geoRisks.length - 1, idx)));
  }, [geoRisks.length]);

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Swipe handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  }, [next, prev]);

  return (
    <div
      id="geo"
      className="bg-brand-surface rounded-2xl border border-border-main/80 dark:border-border-main/30 overflow-hidden shadow-sm hover:shadow-md hover:border-brand-green/30 transition-all duration-300 ease-out cursor-default"
      onTouchStart={isMulti ? handleTouchStart : undefined}
      onTouchEnd={isMulti ? handleTouchEnd : undefined}
    >

      {/* Header Strip */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-main/50">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-text-sub shrink-0" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.07em] text-text-sub">
            Risiko Geografis
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Counter for multi-country */}
          {isMulti && (
            <span className="font-mono text-[10px] text-text-sub/40 tabular-nums">
              {activeIndex + 1}/{geoRisks.length}
            </span>
          )}
          {activeGeo?.country && activeRiskLevel && (
            <span className={`font-sans text-[11px] font-semibold uppercase tracking-[0.07em] ${
              RISK_COLOR[activeRiskLevel.toLowerCase()] ?? "text-text-sub"
            }`}>
              {getRiskLabel(activeRiskLevel)}
            </span>
          )}
        </div>
      </div>

      {/* Country Tabs (only for multi-country) */}
      {isMulti && (
        <div className="px-6 pt-4 pb-1 flex items-center gap-1.5">
          {/* Prev Arrow */}
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            className="p-1 rounded-md hover:bg-brand-deep/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
            aria-label="Negara sebelumnya"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-text-sub" />
          </button>

          {/* Country pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1">
            {geoRisks.map((gr, idx) => {
              const isActive = idx === activeIndex;
              const pillRisk = (gr.risk_level ?? "").toLowerCase();
              return (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`
                    shrink-0 px-3.5 py-1.5 rounded-full font-sans text-[11px] font-semibold tracking-wide
                    border transition-all duration-300 cursor-pointer select-none hover:scale-[1.03] active:scale-[0.97]
                    ${isActive
                      ? `bg-brand-green/15 border-brand-green/40 text-brand-green shadow-sm shadow-brand-green/10`
                      : `bg-brand-deep/20 border-border-main/40 text-text-sub/60 hover:border-border-main/70 hover:text-text-sub`
                    }
                  `}
                >
                  <span className="flex items-center gap-1.5">
                    {/* Tiny risk dot */}
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      pillRisk === "low" ? "bg-risk-low" :
                      pillRisk === "high" || pillRisk === "critical" ? "bg-risk-high" :
                      "bg-risk-medium"
                    }`} />
                    {gr.country || "—"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Next Arrow */}
          <button
            onClick={next}
            disabled={activeIndex === geoRisks.length - 1}
            className="p-1 rounded-md hover:bg-brand-deep/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
            aria-label="Negara berikutnya"
          >
            <ChevronRight className="w-3.5 h-3.5 text-text-sub" />
          </button>
        </div>
      )}

      {/* Active Country Content with slide animation */}
      <div className="p-5 relative overflow-hidden">
        <div
          key={activeIndex}
          className="animate-[fadeInSlide_0.35s_ease_both]"
        >
          <CountrySlide geoRisk={activeGeo} />
        </div>
      </div>
    </div>
  );
}
