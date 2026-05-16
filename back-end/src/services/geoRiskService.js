import { GEO_RISK_DATA } from '../config/constants.js';

// Map risk level string to numeric score
const RISK_LEVEL_SCORES = {
  LOW: 0.2,
  MEDIUM: 0.5,
  HIGH: 0.75,
  CRITICAL: 0.95,
};

// Static geo risk lookup from constants — no longer uses Gemini output
export function analyze(country) {
  const data = GEO_RISK_DATA[country] ?? null;

  if (!data) {
    return {
      country: country ?? null,
      data_available: false,
      risk_level: "MEDIUM",
      risk_score: 0.5,
      fraud_rate: null,
      nearest_kbri: null,
      kbri_distance_note: null,
      crime_index: null,
    };
  }

  return {
    country,
    data_available: true,
    risk_level: data.risk_level,
    risk_score: RISK_LEVEL_SCORES[data.risk_level] ?? 0.5,
    fraud_rate: data.fraud_rate,
    nearest_kbri: data.nearest_kbri,
    kbri_distance_note: data.kbri_distance_note,
    crime_index: data.crime_index,
  };
}