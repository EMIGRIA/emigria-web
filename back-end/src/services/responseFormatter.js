// Helper to translate internal rules/codes to Indonesian labels
function formatRuleIndo(rule) {
  const map = {
    no_company_logo: 'Tidak mencantumkan logo perusahaan resmi',
    no_screening_questions: 'Tidak ada seleksi/pertanyaan penyaringan pelamar',
    unrealistic_salary: 'Penawaran gaji tidak realistis/wajar',
    high_crime_rate: 'Tingkat kriminalitas negara tujuan sangat tinggi',
  };
  if (rule.startsWith('legit_signal_count')) return '';
  return map[rule] ?? rule.replace(/_/g, ' ');
}

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

// Generate a WhatsApp-friendly shareable text containing all real parameters
function generateShareText(riskLevel, title, country, triggeredRules, realityResult, mlResult, company) {
  const isHighRisk = riskLevel === 'high' || riskLevel === 'critical';
  
  // Translate and clean red flags (only if high risk, completely hide/empty for low risk)
  const redFlags = isHighRisk && triggeredRules?.length > 0
    ? triggeredRules.map(formatRuleIndo).filter(Boolean)
    : [];

  if (isHighRisk && realityResult?.salary_is_realistic === false && realityResult.flag) {
    redFlags.push(realityResult.flag);
  }

  // Add educational fallbacks if empty (only for high risk)
  if (isHighRisk && redFlags.length === 0) {
    redFlags.push('Persyaratan tidak mencantumkan lisensi SIP2MI resmi');
    redFlags.push('Deskripsi pekerjaan tidak spesifik / terlampau umum');
  }

  const job = title || 'Lowongan Kerja';
  const loc = country || 'Tidak ditentukan';
  const formattedRisk = isHighRisk ? 'RISIKO TINGGI \u{1F6A8}' : 'RISIKO RENDAH (Relatif Aman) \u{2705}';
  
  // Calculate percentage
  const pct = mlResult?.final_risk_percentage != null
    ? Math.round(mlResult.final_risk_percentage)
    : mlResult?.ml_fraud_probability != null
      ? Math.round(mlResult.ml_fraud_probability * 100)
      : null;
       
  const scoreStr = pct !== null ? ` (${pct}%)` : '';
  const companyInfo = company ? `\u{1F3E2} *Perusahaan/PT:* ${company}\n` : '';

  // Dynamic intro based on risk and company name
  let header = '';
  let intro = '';
  if (isHighRisk) {
    header = `\u{1F6A8} *EMIGRIA FRAUD ALERT!* \u{1F6A8}`;
    intro = company
      ? `Sistem AI Emigria mendeteksi indikasi penipuan pada lowongan kerja dari *${company}*:`
      : `Sistem AI Emigria mendeteksi indikasi penipuan pada lowongan kerja berikut:`;
  } else {
    header = `\u{2705} *HASIL CEK EMIGRIA* \u{2705}`;
    intro = company
      ? `Sistem AI Emigria menganalisis lowongan kerja dari *${company}* relatif aman:`
      : `Sistem AI Emigria menganalisis lowongan kerja berikut relatif aman:`;
  }

  // Base message structure
  let message = 
    `${header}\n\n` +
    `${intro}\n\n` +
    `\u{1F4CC} *Posisi:* ${job}\n` +
    companyInfo +
    `\u{1F5FA}\uFE0F *Negara:* ${loc}\n` +
    `\u{1F4CA} *Status:* ${formattedRisk}${scoreStr}\n\n`;

  // Only render red flags if the listing is High Risk / Warning status
  if (isHighRisk && redFlags.length > 0) {
    message += 
      `\u{1F6A9} *Parameter Keamanan (Red Flags):*\n` +
      redFlags.slice(0, 3).map(f => `• ${f}`).join('\n') + `\n\n`;
  }

  message += 
    `\u{1F4A1} *Tips:* Selalu verifikasi pada penyedia resmi lowongan sebelum mendaftar!\n\n` +
    `Gratis cek keaslian lowongan kerja luar negeri instan di https://landing-page-emigria.vercel.app/`;

  return message;
}

// Combine all pipeline results into a clean unified JSON response
export function format({ scanId, inputType, geminiResult, mlResult, geoResults, realityResult }) {
  // geoResults is always an array; use the first entry as primary for fallback logic
  const primaryGeo = geoResults[0] || {};
  const riskLevel = getRiskLevel(mlResult, primaryGeo);
  const title = geminiResult.extracted_data?.title || null;
  const country = primaryGeo.country || null;
  const triggeredRules = mlResult.triggered_rules ?? [];
  
  // Extract and clean company/PT profile name (first line, sliced to 80 chars max)
  const rawCompany = geminiResult.extracted_data?.company_profile || null;
  const company = rawCompany ? rawCompany.split('\n')[0].trim().substring(0, 80) : null;

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
    // triggered_rules: triggeredRules,
    extracted_data: (() => {
      const { extra, ...clean } = geminiResult.extracted_data || {};
      return clean;
    })(),
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
      share_text: generateShareText(riskLevel, title, country, triggeredRules, realityResult, mlResult, company),
    },
  };
}