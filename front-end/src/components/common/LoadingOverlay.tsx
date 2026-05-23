import { useState, useEffect } from "react";
import { FileText, Link2 } from "lucide-react";

const loadingSteps = [
  "Memindai dokumen...",
  "AI menganalisis konten...",
  "Memeriksa sinyal penipuan...",
  "Memverifikasi risiko negara...",
  "Mengecek kewajaran gaji...",
  "Menyiapkan laporan...",
];

interface LoadingOverlayProps {
  mode: "image" | "text" | "url";
  file: File | null;
  text: string;
  url: string;
}

export default function LoadingOverlay({ mode, file, text, url }: LoadingOverlayProps) {
  const [index, setIndex] = useState(0);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (mode === "image" && file) {
      const u = URL.createObjectURL(file);
      setImgUrl(u);
      return () => {
        URL.revokeObjectURL(u);
      };
    }
  }, [mode, file]);

  return (
    <div className="fixed inset-0 bg-brand-deep/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-brand-surface rounded-2xl p-6 md:p-8 shadow-2xl border border-border-main flex flex-col items-center space-y-6 max-w-sm md:max-w-md w-full text-center animate-[fadeInUp_0.4s_ease_both]">
        
        {/* Minimalist Document Scanning Bay */}
        <div className="relative w-full aspect-[4/3] max-h-[240px] bg-scan-bay bg-dot-grid rounded-xl overflow-hidden border border-border-main flex items-center justify-center shadow-inner select-none">
          {/* Content Rendering based on mode */}
          {mode === "image" && imgUrl ? (
            <div className="relative w-full h-full flex items-center justify-center p-2 bg-scan-bay bg-dot-grid">
              <img
                src={imgUrl}
                alt="Brochure preview"
                className="w-full h-full object-contain transition-opacity duration-300 brightness-[0.8] blur-[0.5px]"
              />
            </div>
          ) : mode === "text" ? (
            <div className="w-full h-full p-6 flex flex-col justify-start text-left overflow-hidden pointer-events-none select-none opacity-60 bg-scan-bay bg-dot-grid">
              <FileText className="w-6 h-6 text-brand-green mb-2 shrink-0 animate-pulse" />
              <p className="font-mono text-[10px] text-brand-green leading-relaxed line-clamp-6 whitespace-pre-wrap">
                {text}
              </p>
            </div>
          ) : (
            <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center pointer-events-none select-none opacity-60 gap-2 bg-scan-bay bg-dot-grid">
              <Link2 className="w-8 h-8 text-brand-green animate-bounce" />
              <p className="font-mono text-[10px] text-brand-green truncate max-w-[200px]">
                {url}
              </p>
            </div>
          )}

          {/* Scanning Sweeping Laser Line */}
          <div className="absolute left-0 right-0 h-0.5 bg-brand-green shadow-[0_0_12px_3px_#16a34a] animate-scan-line pointer-events-none z-20" />
        </div>

        {/* Loading details */}
        <div className="w-full space-y-3.5">
          <div className="h-6 overflow-hidden flex items-center justify-center">
            <p className="font-mono text-xs md:text-sm text-brand-green font-semibold tracking-wider transition-all duration-300">
              {loadingSteps[index]}
            </p>
          </div>

          {/* Sleek Progress Bar Indicator */}
          <div className="w-full h-1 bg-brand-deep rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-green rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((index + 1) / loadingSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
