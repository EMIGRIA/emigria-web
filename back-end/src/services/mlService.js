// Calculate fraud probability (currently using hardcoded rules)
export function predict(extractedData, realityResult) {
  const extracted = extractedData || {};
  const reality = realityResult || {};

  let score = 0.3; // Base fraud score

  // Increase score based on suspicious indicators
  if (extracted.has_company_logo === 0) score += 0.15;
  if (extracted.has_questions === 0) score += 0.10;
  if (extracted.telecommuting === 1) score += 0.05;
  if (reality.salary_is_realistic === false) score += 0.20;
  if (reality.flag) score += 0.10;

  // Cap the maximum score at 1.0 (100%)
  const fraud_probability = Math.round(Math.min(score, 1.0) * 100) / 100;

  return { fraud_probability };
}