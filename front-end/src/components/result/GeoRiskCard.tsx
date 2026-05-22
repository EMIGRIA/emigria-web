import { MapPin, TrendingUp, TrendingDown, Minus, ShieldAlert } from "lucide-react";
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
  geoRisk: GeoRisk;
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

export default function GeoRiskCard({ geoRisk }: GeoRiskCardProps) {
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

  return (
    <div id="geo" className="bg-brand-surface rounded-xl border border-border-main overflow-hidden transition-all duration-300">

      {/* Header Strip */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-main">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-text-sub shrink-0" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.07em] text-text-sub">
            Risiko Geografis
          </span>
        </div>
        {country && risk_level && (
          <span className={`font-sans text-[11px] font-semibold uppercase tracking-[0.07em] ${
            RISK_COLOR[risk_level.toLowerCase()] ?? "text-text-sub"
          }`}>
            {getRiskLabel(risk_level)}
          </span>
        )}
      </div>

      {!country ? (
        <div className="px-5 py-6 flex flex-col items-center justify-center text-center gap-2">
          <ShieldAlert className="w-8 h-8 text-text-muted opacity-30" />
          <p className="font-sans text-sm text-text-sub/50">Negara tujuan tidak terdeteksi dari lowongan ini.</p>
        </div>
      ) : (
        <div className="p-5 flex flex-col gap-4">          {/* Header Section (Country Name + ISO + Year) */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">

            {/* Left Column: Live Map (exact height 220px) */}
            <div className="h-[220px]">
              <CountryMapVisual countryName={country} riskLevel={risk_level ?? "medium"} />
            </div>

            {/* Right Column: Metrics (exact height 220px, flex column to space elements perfectly) */}
            <div className="flex flex-col gap-3 h-[220px] justify-between">

              {/* Row 1: Crime Index + Tingkat (equal heights) */}
              <div className="grid grid-cols-2 gap-3 h-[96px]">
                {/* Crime Index Card */}
                <div className="bg-brand-deep/20 rounded-lg p-3 border border-border-main/50 flex flex-col justify-between transition-all duration-300 hover:border-brand-green/30">
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-text-sub/50">
                    Crime Index
                  </p>
                  <p className="font-mono text-xl font-bold text-text-main leading-none my-1">
                    {crime_index != null ? crime_index.toFixed(2) : "N/A"}
                  </p>
                  <p className="font-mono text-[9px] text-text-sub/30">skala 0–10</p>
                </div>

                {/* Tingkat Card */}
                <div className="bg-brand-deep/20 rounded-lg p-3 border border-border-main/50 flex flex-col justify-between transition-all duration-300 hover:border-brand-green/30">
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
                <div className="bg-brand-deep/20 rounded-lg p-3 border border-border-main/50 flex-1 flex flex-col justify-between transition-all duration-300 hover:border-brand-green/30">
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

            return (
              <div className="bg-brand-deep/20 rounded-lg p-4 border border-border-main/50 transition-all duration-300 hover:border-brand-green/30">
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
                        <linearGradient id="crimeColorGrad" x1="0" y1="0" x2="0" y2="1">
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
                        fill="url(#crimeColorGrad)"
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
      )}
    </div>
  );
}
