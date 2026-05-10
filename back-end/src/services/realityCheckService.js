// Normalize salary standards and reality check data from Gemini
export function analyze(realityCheckFromGemini) {
  const rc = realityCheckFromGemini || {};
  const redFlags = rc.red_flags || [];

  return {
    salary_is_realistic: rc.salary_is_realistic ?? true,
    realistic_salary_range: rc.realistic_salary_range || null,
    salary_gap_assessment: rc.salary_gap_assessment || null,
    suspicious_promises: rc.suspicious_promises || [],
    red_flags: redFlags,
    assessment_summary: rc.assessment_summary || null,
    red_flags_count: redFlags.length,
  };
}