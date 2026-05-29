import { useState, useEffect } from "react";
import api from "../lib/api";

export interface RecentScan {
  id: string;
  input_type: string;
  country: string | null;
  job_title: string | null;
  salary: string | null;
  company_name: string | null;
  final_risk_percentage: number | null;
  risk_level: string;
  geo_risk_level: string | null;
  salary_realistic: boolean | null;
  created_at: string;
}

export interface AnalyticsData {
  total_scans: number;
  high_risk_scans: number;
  fraud_rate: number;
  avg_risk_percentage: number | null;
  top_countries: Array<{ country: string; count: number }>;
  salary_realistic_stats: {
    realistic: number;
    unrealistic: number;
    unknown: number;
  };
  scans_last_7_days: number;
  recent_scans: RecentScan[];
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/api/analytics");
        if (active && response.data?.analytics) {
          setData(response.data.analytics);
        }
      } catch (err) {
        console.warn("Silent fail: Gagal mengambil data analitik.", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}
