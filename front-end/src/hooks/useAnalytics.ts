import { useState, useEffect } from "react";
import api from "../lib/api";

export interface AnalyticsData {
  total_scans: number;
  fraud_rate: number;
  top_countries?: Array<{ country: string; count: number }>;
  common_rules?: Array<{ rule: string; count: number }>;
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/api/analytics");
        if (active) {
          setData(response.data);
        }
      } catch (err) {
        console.warn("Silent fail: Gagal mengambil data analitik.", err);
        // Silent fail as specified
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
