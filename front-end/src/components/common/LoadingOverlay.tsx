import { useState, useEffect } from "react";

const loadingSteps = [
  "Memindai dokumen...",
  "AI menganalisis konten...",
  "Memeriksa sinyal penipuan...",
  "Memverifikasi risiko negara...",
  "Mengecek kewajaran gaji...",
  "Menyiapkan laporan...",
];

export default function LoadingOverlay() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-brand-deep/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-brand-surface rounded-2xl p-8 shadow-2xl border border-border-main flex flex-col items-center space-y-6 max-w-xs w-full text-center animate-[fadeInUp_0.4s_ease_both]">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-brand-deep"></div>
          <div className="absolute inset-0 rounded-full border-4 border-brand-green border-t-transparent animate-spin"></div>
        </div>

        {/* Text cycle */}
        <div className="h-6 overflow-hidden">
          <p className="font-mono text-sm text-brand-green font-medium transition-all duration-300">
            {loadingSteps[index]}
          </p>
        </div>
      </div>
    </div>
  );
}
