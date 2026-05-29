import { prisma } from '../config/db.js';

export const getTrends = async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalScans,
    highRiskScans,
    topCountries,
    avgRisk,
    recentScansCount,
    salaryRealistic,
    salaryUnrealistic,
    recentScanRows,
  ] = await Promise.all([
    // 1. Total scan count
    prisma.scanLog.count(),

    // 2. High + critical risk count
    prisma.scanLog.count({
      where: {
        risk_level: { in: ['high', 'critical'] },
      },
    }),

    // 3. Top 5 countries by scan count
    prisma.scanLog.groupBy({
      by: ['country'],
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 5,
      where: { country: { not: null } },
    }),

    // 4. Average final risk percentage
    prisma.scanLog.aggregate({
      _avg: { final_risk_percentage: true },
    }),

    // 5. Scans in last 7 days
    prisma.scanLog.count({
      where: {
        created_at: { gte: sevenDaysAgo },
      },
    }),

    // 6. Salary realistic count
    prisma.scanLog.count({
      where: { salary_realistic: true },
    }),

    // 7. Salary unrealistic count
    prisma.scanLog.count({
      where: { salary_realistic: false },
    }),

    // 8. Recent 10 scans (all essential fields)
    prisma.scanLog.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        id: true,
        input_type: true,
        country: true,
        job_title: true,
        salary: true,
        company_name: true,
        final_risk_percentage: true,
        risk_level: true,
        geo_risk_level: true,
        salary_realistic: true,
        created_at: true,
      },
    }),
  ]);

  // Compute fraud rate
  const fraudRate = totalScans > 0 ? highRiskScans / totalScans : 0;

  return res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    analytics: {
      total_scans: totalScans,
      high_risk_scans: highRiskScans,
      fraud_rate: Math.round(fraudRate * 100) / 100,
      avg_risk_percentage: avgRisk._avg.final_risk_percentage
        ? Math.round(avgRisk._avg.final_risk_percentage * 10) / 10
        : null,
      top_countries: topCountries.map((c) => ({
        country: c.country,
        count: c._count.country,
      })),
      salary_realistic_stats: {
        realistic: salaryRealistic,
        unrealistic: salaryUnrealistic,
        unknown: totalScans - salaryRealistic - salaryUnrealistic,
      },
      scans_last_7_days: recentScansCount,
      recent_scans: recentScanRows,
    },
  });
};
