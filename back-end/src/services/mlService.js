// Calculate fraud probability (currently using hardcoded rules)
export function predict(geminiResult) {
  const extracted = geminiResult.extracted_data || {};
  const realityCheck = geminiResult.reality_check || {};
  const geoRisk = geminiResult.geo_risk || {};

  let score = 0.3; // Base fraud score

  // Increase score based on suspicious indicators
  if (extracted.has_company_logo === 0) score += 0.15;
  if (extracted.has_questions === 0) score += 0.10;
  if (extracted.telecommuting === 1) score += 0.05;
  if (realityCheck.salary_is_realistic === false) score += 0.20;

  const redFlags = realityCheck.red_flags || [];
  if (redFlags.length > 0) score += Math.min(redFlags.length * 0.05, 0.20);
  if (geoRisk.is_known_high_risk === true) score += 0.15;

  // Cap the maximum score at 1.0 (100%)
  const fraud_probability = Math.round(Math.min(score, 1.0) * 100) / 100;

  return { fraud_probability };
}