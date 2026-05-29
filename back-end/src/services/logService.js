import { prisma } from '../config/db.js';

export async function save(formattedResponse) {
  // geo_risk is now an array; use primary (first) entry for log
  const primaryGeo = Array.isArray(formattedResponse.geo_risk)
    ? formattedResponse.geo_risk[0]
    : formattedResponse.geo_risk;

  // Extract and clean company name (first line, max 80 chars)
  const rawCompany = formattedResponse.extracted_data?.company_profile || null;
  const companyName = rawCompany
    ? rawCompany.split('\n')[0].trim().substring(0, 80)
    : null;

  return await prisma.scanLog.create({
    data: {
      input_type: formattedResponse.input_type,
      country: primaryGeo?.country || null,
      job_title: formattedResponse.extracted_data?.title || null,
      salary: formattedResponse.extracted_data?.salary_range || null,
      company_name: companyName,
      final_risk_percentage: formattedResponse.verdict?.final_risk_percentage ?? null,
      risk_level: formattedResponse.verdict?.risk_level || 'high',
      geo_risk_level: primaryGeo?.risk_level || null,
      salary_realistic: formattedResponse.reality_check?.salary_is_realistic ?? null,
    },
  });
}