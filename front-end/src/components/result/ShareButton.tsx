import toast from "react-hot-toast";
import { Share2, MessageCircle } from "lucide-react";

interface ShareButtonProps {
  shareText: string;
}

export default function ShareButton({ shareText }: ShareButtonProps) {
  const handleShare = async () => {
    const payload = {
      title: "Hasil Cek Emigria",
      text: shareText,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (e: any) {
        if (e.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
      toast.success("Laporan berhasil disalin.");
    } catch {
      toast.error("Gagal menyalin teks.");
    }
  };

  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${window.location.href}`)}`;

  return (
    <div id="bagikan" className="bg-brand-surface rounded-xl border border-border-main overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border-main">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.07em] text-text-sub">
          Bagikan Laporan
        </span>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* body-sm description */}
        <p className="font-sans text-sm text-text-sub leading-[1.5]">
          Bantu lindungi orang-orang terdekat dari penipuan kerja luar negeri.
        </p>

        {/* Buttons — button-md from MONGODESIGN (14px, 600) */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans text-sm font-semibold py-2.5 px-4 rounded-full transition-colors cursor-pointer select-none"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 border border-border-main hover:border-brand-green/40 hover:text-brand-green text-text-sub font-sans text-sm font-semibold py-2.5 px-4 rounded-full transition-colors cursor-pointer select-none bg-transparent"
          >
            <Share2 className="w-4 h-4" />
            Salin Tautan
          </button>
        </div>
      </div>
    </div>
  );
}
