import Navbar from "../components/common/Navbar";
import ScanInput from "../components/scan/ScanInput";
import StatsBanner from "../components/common/StatsBanner";
import { UploadCloud, Brain, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-deep flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full flex flex-col justify-center space-y-8 pb-20 md:pb-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="hero-headline font-display text-3xl md:text-3xl lg:text-5xl font-bold leading-tight text-text-main tracking-tight">
            Cek Lowongan Kerja Luar Negeri Sebelum Terlambat
          </h1>
          <p className="hero-sub font-sans text-xs md:text-sm text-text-sub max-w-md mx-auto leading-relaxed">
            Deteksi penipuan berbasis AI. Gratis. Tanpa daftar.
          </p>
        </div>

        {/* Scan Input Container */}
        <div className="scan-card">
          <ScanInput />
        </div>

        {/* Stats Banner */}
        <StatsBanner />

        {/* How It Works Section */}
        <div className="border-t border-border-main pt-8 space-y-6">
          <h2 className="font-display italic text-2xl font-bold text-center text-text-main">
            Cara Kerja
          </h2>

          <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
            <div className="bg-brand-surface border border-border-main rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 hover:border-brand-green/30 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-deep flex items-center justify-center border border-border-main text-brand-green">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-[10px] md:text-xs text-text-main uppercase tracking-wider">
                1. Upload
              </h3>
              <p className="font-sans text-[9px] md:text-[10px] text-text-sub/80 leading-relaxed max-w-[120px]">
                Unggah brosur foto, tempel teks, atau masukkan URL lowongan.
              </p>
            </div>

            <div className="bg-brand-surface border border-border-main rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 hover:border-brand-green/30 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-deep flex items-center justify-center border border-border-main text-brand-green">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-[10px] md:text-xs text-text-main uppercase tracking-wider">
                2. AI Analisis
              </h3>
              <p className="font-sans text-[9px] md:text-[10px] text-text-sub/80 leading-relaxed max-w-[120px]">
                Sistem AI kami akan memindai & mengevaluasi risiko penipuan.
              </p>
            </div>

            <div className="bg-brand-surface border border-border-main rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 hover:border-brand-green/30 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-deep flex items-center justify-center border border-border-main text-brand-green">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-[10px] md:text-xs text-text-main uppercase tracking-wider">
                3. Lihat Hasil
              </h3>
              <p className="font-sans text-[9px] md:text-[10px] text-text-sub/80 leading-relaxed max-w-[120px]">
                Dapatkan visualisasi tingkat bahaya, kriteria gaji, dan info KBRI.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
