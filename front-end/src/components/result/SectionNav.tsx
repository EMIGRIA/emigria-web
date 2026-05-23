import { useState, useEffect } from "react";

export default function SectionNav() {
  const [activeSection, setActiveSection] = useState("ringkasan");
  
  useEffect(() => {
    const handleScroll = () => {

      // Detect active section based on scroll position
      const sections = ["ringkasan", "gaji", "geo", "bagikan"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // accounting for sticky navbar + sectionnav height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  const navItems = [
    { id: "ringkasan", label: "Ringkasan" },
    { id: "gaji",      label: "Gaji" },
    { id: "geo",       label: "Geo" },
    { id: "bagikan",   label: "Bagikan" },
  ];

  return (
    <div className="sticky top-[50px] z-40 bg-brand-deep/95 backdrop-blur-md border-b border-border-main py-3 scrollbar-none overflow-x-auto -mx-4 px-4 transition-colors duration-300 lg:hidden">
      <div className="max-w-4xl mx-auto flex items-center gap-2 md:justify-center whitespace-nowrap">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`text-xs font-sans font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none ${
              activeSection === item.id
                ? "bg-brand-cta text-[#001e2b] border-brand-cta font-semibold shadow-sm"
                : "bg-brand-surface text-text-sub border-border-main hover:text-brand-green"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
