import { prisma } from '../config/db.js';

export const getTrends = async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [totalScans, highRiskScans, topCountries, avgScore, recentScans] =
    await Promise.all([
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

      // 4. Average fraud score
      prisma.scanLog.aggregate({
        _avg: { fraud_score: true },
      }),

      // 5. Scans in last 7 days
      prisma.scanLog.count({
        where: {
          created_at: { gte: sevenDaysAgo },
        },
      }),
    ]);

  return res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    analytics: {
      total_scans: totalScans,
      high_risk_scans: highRiskScans,
      top_countries: topCountries.map((c) => ({
        country: c.country,
        count: c._count.country,
      })),
      average_fraud_score: avgScore._avg.fraud_score
        ? Math.round(avgScore._avg.fraud_score * 100) / 100
        : null,
      scans_last_7_days: recentScans,
    },
  });
};
