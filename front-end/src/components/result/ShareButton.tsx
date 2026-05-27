import toast from "react-hot-toast";
import { Share2, MessageCircle } from "lucide-react";

interface ShareButtonProps {
  shareText: string;
}

export default function ShareButton({ shareText }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Laporan berhasil disalin.");
    } catch {
      toast.error("Gagal menyalin laporan.");
    }
  };

  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
3
  return (
    <div id="bagikan" className="bg-brand-surface rounded-2xl border border-border-main/80 dark:border-border-main/30 overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] hover:border-brand-green/30 transition-all duration-300 ease-out cursor-default">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-main/50">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.07em] text-text-sub">
          Bagikan Laporan
        </span>
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* body-sm description */}
        <p className="font-sans text-sm text-text-sub leading-[1.5]">
          Bantu lindungi orang-orang terdekat dari penipuan kerja luar negeri.
        </p>

        {/* Buttons — button-md from MONGODESIGN (14px, 600) */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white dark:bg-[#00cb55] dark:hover:bg-[#00d656] dark:text-[#001e2b] font-sans text-sm font-semibold py-2.5 px-4 rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 border border-border-main hover:border-brand-green/40 hover:text-brand-green text-text-sub font-sans text-sm font-semibold py-2.5 px-4 rounded-full bg-transparent hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
          >
            <Share2 className="w-4 h-4" />
            Salin Laporan
          </button>
        </div>
      </div>
    </div>
  );
}
