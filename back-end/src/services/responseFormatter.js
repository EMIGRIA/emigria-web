// Determine frontend-facing risk_level from ML result + geo fallback
function getRiskLevel(mlResult, geoResult) {
  if (mlResult.is_fallback === true) {
    // FastAPI was unreachable — fall back to geo risk
    const geo = (geoResult.risk_level || '').toUpperCase();
    if (geo === 'CRITICAL') return 'critical';
    if (geo === 'HIGH') return 'high';
    if (geo === 'MEDIUM') return 'medium';
    return 'low';
  }

  // Normal path — use ML verdict (binary: >= 50% HIGH, < 50% LOW)
  if (mlResult.risk_level === 'HIGH_RISK') return 'high';
  if (mlResult.risk_level === 'LOW_RISK') return 'low';
  // REVIEW or unknown → treat as high (safe default)
  return 'high';
}

// Generate an automatic summary text in Indonesian
function generateSummaryText(riskLevel) {
  if (riskLevel === 'high' || riskLevel === 'critical') {
    return 'Lowongan ini terindikasi penipuan.';
  }
  // low
  return (
    'Lowongan ini tampak relatif aman. ' +
    'Tetap lakukan verifikasi mandiri sebelum mendaftar.'
  );
}

// Generate a WhatsApp-friendly shareable text
function generateShareText(riskLevel, title, country, triggeredRules, realityResult) {
  const redFlags = triggeredRules?.length > 0
    ? triggeredRules
    : realityResult.flag
      ? [realityResult.flag]
      : [];

  const job = title || 'Lowongan Kerja';
  const loc = country || '-';

  return (
    '⚠️ *PERINGATAN LOWONGAN KERJA*\n' +
    'Posisi: ' + job + '\n' +
    'Lokasi: ' + loc + '\n' +
    'Status: ' + riskLevel.toUpperCase() + '\n\n' +
    'Red Flags:\n' +
    redFlags.slice(0, 3).map(f => '• ' + f).join('\n') +
    '\n\nDiverifikasi oleh Emigria'
  );
}

// Combine all pipeline results into a clean unified JSON response
export function format({ scanId, inputType, geminiResult, mlResult, geoResults, realityResult }) {
  // geoResults is always an array; use the first entry as primary for fallback logic
  const primaryGeo = geoResults[0] || {};
  const riskLevel = getRiskLevel(mlResult, primaryGeo);
  const title = geminiResult.extracted_data?.title || null;
  const country = primaryGeo.country || null;
  const triggeredRules = mlResult.triggered_rules ?? [];

  return {
    success: true,
    scan_id: scanId,
    timestamp: new Date().toISOString(),
    input_type: inputType,
    verdict: {
      risk_level: riskLevel,
      ml_risk_level: mlResult.risk_level,
      ml_fraud_probability: mlResult.ml_fraud_probability,
      ml_fraud_percentage: mlResult.ml_fraud_percentage ?? null,
      pmi_rule_score: mlResult.pmi_rule_score,
      pmi_risk_percentage: mlResult.pmi_risk_percentage ?? null,
      final_risk_score: mlResult.final_risk_score ?? null,
      final_risk_percentage: mlResult.final_risk_percentage ?? null,
      fraud_prediction: mlResult.fraud_prediction,
      hard_stop_triggered: mlResult.hard_stop_triggered ?? false,
      geo_risk_score: primaryGeo.risk_score,
      is_fallback: mlResult.is_fallback,
    },
    triggered_rules: triggeredRules,
    extracted_data: (() => {
      const { extra, ...clean } = geminiResult.extracted_data || {};
      return clean;
    })(),
    // risk_signals: geminiResult.extracted_data?.extra?.risk_signals ?? null,
    reality_check: {
      data_available: realityResult.data_available,
      salary_is_realistic: realityResult.salary_is_realistic,
      offered_salary_idr: realityResult.offered_salary_idr,
      standard_min_idr: realityResult.standard_min_idr,
      standard_max_idr: realityResult.standard_max_idr,
      source: realityResult.source,
      currency_note: realityResult.currency_note,
      flag: realityResult.flag,
    },
    // Always return geo_risk as an array for multi-country support
    geo_risk: geoResults.map(gr => ({
      country: gr.country,
      data_available: gr.data_available,
      iso3: gr.iso3,
      year: gr.year,
      risk_level: gr.risk_level,
      risk_score: gr.risk_score,
      crime_index: gr.crime_index,
      crime_level: gr.crime_level,
      crime_variation: gr.crime_variation,
      crime_rankings: gr.crime_rankings,
      crime_historical: gr.crime_historical,
      source_note: gr.source_note,
    })),
    smart_action: {
      summary_text: generateSummaryText(riskLevel),
      share_text: generateShareText(riskLevel, title, country, triggeredRules, realityResult),
    },
  };
}