// Convert fraud probability score (0.0 - 1.0) into a risk tier
function getRiskLevel(fraudScore) {
  if (fraudScore >= 0.80) return 'critical';
  if (fraudScore >= 0.60) return 'high';
  if (fraudScore >= 0.40) return 'medium';
  return 'low';
}

// Generate an automatic summary text in Indonesian
function generateSummaryText(riskLevel, fraudScore) {
  const pct = Math.round(fraudScore * 100);
  const map = {
    critical: `⛔ BAHAYA TINGGI! Lowongan ini memiliki skor penipuan ${pct}%. Sangat tidak disarankan untuk melamar. Banyak tanda-tanda penipuan yang terdeteksi.`,
    high: `⚠️ WASPADA! Lowongan ini memiliki skor penipuan ${pct}%. Terdapat beberapa tanda mencurigakan. Lakukan verifikasi lebih lanjut sebelum melamar.`,
    medium: `🟡 HATI-HATI. Lowongan ini memiliki skor penipuan ${pct}%. Ada beberapa hal yang perlu diverifikasi. Pastikan untuk mengecek kredibilitas perusahaan.`,
    low: `✅ RISIKO RENDAH. Lowongan ini memiliki skor penipuan ${pct}%. Terlihat cukup aman, namun tetap lakukan pengecekan standar.`,
  };
  return map[riskLevel] || `Skor penipuan: ${pct}%.`;
}

// Generate a WhatsApp-friendly shareable text
function generateShareText(riskLevel, fraudScore, title, country) {
  const pct = Math.round(fraudScore * 100);
  const job = title || 'Lowongan Kerja';
  const loc = country ? ` di ${country}` : '';
  return `🔍 *Hasil Pemeriksaan Emigria*\n\nLowongan: ${job}${loc}\nSkor Penipuan: ${pct}%\nTingkat Risiko: ${riskLevel.toUpperCase()}\n\n${generateSummaryText(riskLevel, fraudScore)}\n\nCek lowongan kerjamu di Emigria → emigria.vercel.app`;
}

// Combine all pipeline results into a clean unified JSON response
export function format({ scanId, inputType, geminiResult, mlResult, geoResult, realityResult }) {
  const fraudScore = mlResult.fraud_probability;
  const riskLevel = getRiskLevel(fraudScore);
  const title = geminiResult.extracted_data?.title || null;
  const country = geoResult.country || null;

  return {
    success: true,
    scan_id: scanId,
    timestamp: new Date().toISOString(),
    input_type: inputType,
    verdict: {
      risk_level: riskLevel,
      fraud_score: fraudScore,
      geo_risk_score: geoResult.risk_score,
    },
    extracted_data: geminiResult.extracted_data,
    reality_check: realityResult,
    geo_risk: geoResult,
    smart_action: {
      summary_text: generateSummaryText(riskLevel, fraudScore),
      share_text: generateShareText(riskLevel, fraudScore, title, country),
    },
  };
}