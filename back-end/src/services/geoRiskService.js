// Default risk scores mapped by severity level
const RISK_LEVEL_SCORES = { low: 0.2, medium: 0.5, high: 0.75, critical: 0.95 };

// Normalize geographic risk data extracted by Gemini
export function analyze(geoRiskFromGemini) {
  const geo = geoRiskFromGemini || {};
  const riskLevel = geo.risk_level || 'medium';
  const riskScore = geo.risk_score != null ? geo.risk_score : (RISK_LEVEL_SCORES[riskLevel] ?? 0.5);

  return {
    country: geo.country_identified || null,
    risk_level: riskLevel,
    risk_score: riskScore,
    risk_factors: geo.risk_factors || [],
    worker_safety_notes: geo.worker_safety_notes || null,
    is_known_high_risk: geo.is_known_high_risk === true,
  };
}