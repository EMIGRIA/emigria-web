import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import OfficialDataCard from "./OfficialDataCard";

interface GeoRisk {
  country: string | null;
  iso3?: string | null;
}

interface OfficialDataStickyNoteProps {
  geoRisks: GeoRisk[];
}

export default function OfficialDataStickyNote({ geoRisks }: OfficialDataStickyNoteProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll inline card into view smoothly when expanded
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        if (containerRef.current) {
          // Scroll the card to the center or start of the viewport
          containerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest", // nearest makes it perfectly positioned in-screen
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // If expanded, morph in-place into the standard OfficialDataCard
  if (isExpanded) {
    return (
      <div
        ref={containerRef}
        className="scroll-mt-6 animate-[fadeInUp_0.35s_ease_both]"
      >
        <OfficialDataCard
          geoRisks={geoRisks}
          onClose={() => setIsExpanded(false)}
        />
      </div>
    );
  }

  // Otherwise, render the beautiful Post-it style Sticky Note in-place with a telephone-like wiggle animation
  return (
    <div
      onClick={() => setIsExpanded(true)}
      className="relative group cursor-pointer transition-all duration-350 ease-out select-none animate-[fadeInUp_0.35s_ease_both]"
    >
      {/* Semi-translucent adhesive tape graphic at the top - matching light slate-gray (#e4e8ec) */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-4.5 bg-[#e4e8ec]/90 dark:bg-brand-surface/90 backdrop-blur-xs border border-[#cbd5e1]/80 dark:border-border-main/80 rounded-xs shadow-[0_1px_3px_rgba(0,0,0,0.03)] rotate-[-1deg] group-hover:rotate-0 transition-transform duration-300 z-20 pointer-events-none" />

      {/* Post-it Paper body */}
      <div
        className="
          relative px-5 py-6 rounded-lg 
          bg-[#fef9c3] dark:bg-brand-surface 
          border border-border-main 
          text-text-main 
          shadow-md hover:shadow-lg 
          rotate-[-1.5deg] group-hover:rotate-0 group-hover:-translate-y-1 
          animate-subtle-vibe group-hover:animate-none
          transition-all duration-300 ease-out
        "
      >
        {/* Paper curl shadow effect at bottom-right */}
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-tr from-black/5 to-transparent rounded-bl-sm pointer-events-none" />

        {/* Sticky Note Content */}
        <div className="space-y-3 font-sans">
          <div className="flex items-center gap-1.5 border-b border-border-main/50 pb-2">
            <Info className="w-4 h-4 text-brand-green shrink-0" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest leading-none text-text-main">
              Info Resmi BP2MI
            </span>
          </div>

          <p className="text-xs font-semibold leading-relaxed tracking-wide text-text-sub">
            Ada lowongan kerja luar negeri resmi &amp; aman terverifikasi langsung dari pemerintah.
          </p>

          <div className="flex items-center gap-1 pt-1 text-[10px] font-bold text-brand-green group-hover:underline">
            <span>Klik untuk lihat peluang</span>
            <span className="inline-block animate-[bounce_1.5s_infinite]">👉</span>
          </div>
        </div>
      </div>
    </div>
  );
}
