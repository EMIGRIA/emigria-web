import { prisma } from '../config/db.js';

export async function save(formattedResponse) {
  return await prisma.scanLog.create({
    data: {
      input_type: formattedResponse.input_type,
      country: formattedResponse.geo_risk?.country || null,
      title: formattedResponse.extracted_data?.title || null,
      industry: formattedResponse.extracted_data?.industry || null,
      employment_type: formattedResponse.extracted_data?.employment_type || null,
      fraud_score: formattedResponse.verdict?.fraud_score ?? null,
      risk_level: formattedResponse.verdict?.risk_level || 'medium',
      geo_risk_score: formattedResponse.geo_risk?.risk_score ?? null,
      geo_risk_level: formattedResponse.geo_risk?.risk_level || null,
      salary_realistic: formattedResponse.reality_check?.salary_is_realistic ?? null,
      red_flags_count: formattedResponse.reality_check?.red_flags_count ?? 0,
      telecommuting: formattedResponse.extracted_data?.telecommuting ?? null,
      has_company_logo: formattedResponse.extracted_data?.has_company_logo ?? null,
      has_questions: formattedResponse.extracted_data?.has_questions ?? null,
    },
  });
}