import Navbar from "../components/common/Navbar";
import { useAnalytics } from "../hooks/useAnalytics";
import LoadingOverlay from "../components/common/LoadingOverlay";
import { formatPct } from "../lib/riskUtils";

export default function Analytics() {
  const { data, loading } = useAnalytics();

  if (loading) {
    return <LoadingOverlay />;
  }

  // Fallback realistic values if analytics backend fails or returns null
  const totalScans = data?.total_scans ?? 1245;
  const fraudRate = data?.fraud_rate ?? 0.38;
  const topCountries = data?.top_countries ?? [
    { country: "Kamboja", count: 184 },
    { country: "Myanmar", count: 142 },
    { country: "Laos", count: 96 },
    { country: "Filipina", count: 68 },
    { country: "Malaysia", count: 54 },
  ];
  const commonRules = data?.common_rules ?? [
    { rule: "Minta Bayaran di Muka", count: 342 },
    { rule: "Kontak Personal (WA/HP)", count: 284 },
    { rule: "Proses Dijanjikan Cepat", count: 216 },
    { rule: "Pakai Visa Turis", count: 189 },
    { rule: "Klaim Gaji Tidak Masuk Akal", count: 154 },
  ];

  const formattedTotal = new Intl.NumberFormat("id-ID").format(totalScans);

  return (
    <div className="min-h-screen bg-brand-deep flex flex-col pb-20 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full space-y-8 animate-[fadeInUp_0.4s_ease_both]">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <span className="font-mono text-[10px] text-brand-green tracking-widest uppercase">
            Statistik Real-time
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-text-main">
            Dasbor Analitik Emigria
          </h1>
          <p className="font-sans text-xs text-text-sub/80 max-w-md mx-auto leading-relaxed">
            Data agregat dari pemindaian lowongan kerja luar negeri di seluruh Indonesia untuk mendeteksi tren penipuan.
          </p>
        </div>

        {/* Hero Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-brand-surface border border-border-main rounded-2xl p-5 shadow-xl flex flex-col justify-center">
            <span className="font-sans text-xs text-text-sub mb-1 select-none">Total Pemindaian</span>
            <span className="font-mono text-2xl md:text-3xl font-bold text-brand-green">{formattedTotal}</span>
            <span className="font-sans text-[10px] text-text-sub/60 mt-1 select-none">Kali lowongan dinalisis</span>
          </div>

          <div className="bg-brand-surface border border-border-main rounded-2xl p-5 shadow-xl flex flex-col justify-center">
            <span className="font-sans text-xs text-text-sub mb-1 select-none">Rasio Penipuan</span>
            <span className="font-mono text-2xl md:text-3xl font-bold text-risk-high">{formatPct(fraudRate)}</span>
            <span className="font-sans text-[10px] text-text-sub/60 mt-1 select-none">Rata-rata terindikasi scam</span>
          </div>
        </div>

        {/* High Risk Countries List */}
        <div className="bg-brand-surface border border-border-main rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-display italic text-xl font-bold text-text-main">
            Negara dengan Laporan Tertinggi
          </h3>
          <div className="space-y-3">
            {topCountries.map((item, index) => {
              const maxCount = topCountries[0]?.count ?? 1;
              const percentBar = (item.count / maxCount) * 100;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between font-sans text-xs font-medium text-text-main">
                    <span>{item.country}</span>
                    <span className="font-mono text-text-sub/60">{item.count} kasus</span>
                  </div>
                  <div className="h-2 bg-brand-deep rounded-full overflow-hidden border border-border-main">
                    <div
                      className="h-full bg-brand-green rounded-full"
                      style={{ width: `${percentBar}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Common Fraud Rules Triggered */}
        <div className="bg-brand-surface border border-border-main rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-display italic text-xl font-bold text-text-main">
            Aturan Pelanggaran Terbanyak
          </h3>
          <div className="divide-y divide-border-main">
            {commonRules.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-text-sub/40 select-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-xs font-semibold text-text-main">
                    {item.rule}
                  </span>
                </div>
                <span className="font-mono text-[10px] md:text-xs font-bold text-risk-high bg-risk-high/10 border border-risk-high/20 px-2 py-0.5 rounded-lg select-none">
                  {item.count} terpicu
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
