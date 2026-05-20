import { MapPin, Building2 } from "lucide-react";
import { getRiskLabel } from "../../lib/riskUtils";

interface GeoRisk {
  country: string | null;
  risk_level: string | null;
  fraud_rate: number | null;
  nearest_kbri: string | null;
  kbri_distance_note: string | null;
  crime_index: number | null;
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

export default function GeoRiskCard({ geoRisk }: GeoRiskCardProps) {
  const { country, risk_level, fraud_rate, nearest_kbri, kbri_distance_note, crime_index } = geoRisk;

  return (
    <div id="geo" className="bg-brand-surface rounded-xl border border-border-main overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border-main">
        <MapPin className="w-3.5 h-3.5 text-text-sub shrink-0" />
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.07em] text-text-sub">
          Risiko Geografis
        </span>
      </div>

      {!country ? (
        <div className="px-5 py-4">
          <p className="font-sans text-sm text-text-sub/50">Negara tujuan tidak terdeteksi dari lowongan ini.</p>
        </div>
      ) : (
        <>
          {/* Country + risk label — heading-3 scale for country */}
          <div className="px-5 pt-4 pb-3 flex items-end justify-between gap-4">
            <p className="font-sans text-[28px] font-medium leading-[1.3] tracking-[-0.03em] text-text-main">
              {country}
            </p>
            {risk_level && (
              <span className={`font-sans text-[11px] font-semibold uppercase tracking-[0.06em] pb-1 ${
                RISK_COLOR[risk_level.toLowerCase()] ?? "text-text-sub"
              }`}>
                {getRiskLabel(risk_level)}
              </span>
            )}
          </div>

          {/* Metrics — micro-uppercase labels, Source Code Pro values */}
          {(fraud_rate != null || crime_index != null) && (
            <div className="px-5 pb-4 flex items-start gap-8">
              {fraud_rate != null && (
                <div>
                  <p className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-text-sub/50 mb-1">
                    Fraud Rate
                  </p>
                  <p className="font-mono text-base font-semibold text-text-main">
                    {Math.round(fraud_rate * 100)}%
                  </p>
                </div>
              )}
              {crime_index != null && (
                <div>
                  <p className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-text-sub/50 mb-1">
                    Crime Index
                  </p>
                  <p className="font-mono text-base font-semibold text-text-main">
                    {crime_index}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* KBRI — body-sm with icon */}
          {nearest_kbri && (
            <div className="px-5 py-3.5 border-t border-border-main flex items-start gap-2.5">
              <Building2 className="w-3.5 h-3.5 text-brand-green shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-green mb-1">
                  KBRI Terdekat
                </p>
                <p className="font-sans text-sm font-medium text-text-main">{nearest_kbri}</p>
                {kbri_distance_note && (
                  <p className="font-sans text-[13px] text-text-sub/60 mt-0.5 leading-[1.4]">
                    {kbri_distance_note}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
