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

  // Normal path — use ML verdict
  if (mlResult.risk_level === 'HIGH_RISK') return 'high';
  if (mlResult.risk_level === 'LOW_RISK') return 'low';
  return 'medium';
}

// Generate an automatic summary text in Indonesian
function generateSummaryText(riskLevel, triggeredRules) {
  if (riskLevel === 'high' || riskLevel === 'critical') {
    return (
      'Lowongan ini terindikasi penipuan. ' +
      'Ditemukan ' + triggeredRules.length + ' red flag: ' +
      triggeredRules.slice(0, 2).join(', ') + '.'
    );
  }
  if (riskLevel === 'low') {
    return (
      'Lowongan ini tampak relatif aman. ' +
      'Tetap lakukan verifikasi mandiri sebelum mendaftar.'
    );
  }
  // medium
  return (
    'Lowongan ini memiliki beberapa indikasi mencurigakan. ' +
    'Lakukan verifikasi lebih lanjut sebelum mendaftar.'
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
export function format({ scanId, inputType, geminiResult, mlResult, geoResult, realityResult }) {
  const riskLevel = getRiskLevel(mlResult, geoResult);
  const title = geminiResult.extracted_data?.title || null;
  const country = geoResult.country || null;
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
      pmi_rule_score: mlResult.pmi_rule_score,
      fraud_prediction: mlResult.fraud_prediction,
      geo_risk_score: geoResult.risk_score,
      is_fallback: mlResult.is_fallback,
    },
    triggered_rules: triggeredRules,
    extracted_data: (() => {
      const { extra, ...clean } = geminiResult.extracted_data || {};
      return clean;
    })(),
    risk_signals: geminiResult.extracted_data?.extra?.risk_signals ?? null,
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
    geo_risk: {
      country: geoResult.country,
      data_available: geoResult.data_available,
      risk_level: geoResult.risk_level,
      risk_score: geoResult.risk_score,
      fraud_rate: geoResult.fraud_rate,
      nearest_kbri: geoResult.nearest_kbri,
      kbri_distance_note: geoResult.kbri_distance_note,
      crime_index: geoResult.crime_index,
    },
    smart_action: {
      summary_text: generateSummaryText(riskLevel, triggeredRules),
      share_text: generateShareText(riskLevel, title, country, triggeredRules, realityResult),
    },
  };
}