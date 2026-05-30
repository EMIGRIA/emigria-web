import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { BarChart3, ArrowLeft, Moon, Sun } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isResult    = location.pathname === "/result";
  const isAnalytics = location.pathname === "/analytics";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-main/50 bg-brand-surface/35 backdrop-blur-xl transition-colors duration-300">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-green/40 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 group cursor-pointer select-none"
        >
          <div className="w-7 h-7 rounded-lg bg-white dark:bg-white/95 flex items-center justify-center shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] border border-black/5 dark:border-white/10 group-hover:scale-105 transition-all duration-200 p-0.5">
            <img
              src="/logo.png"
              alt="Emigria Logo"
              className="w-full h-full object-contain select-none pointer-events-none"
            />
          </div>
          <span className="font-sans font-bold text-[17px] tracking-tight text-text-main group-hover:text-brand-green transition-colors duration-200">
            Emigria
          </span>
        </button>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-2">

          {/* Context nav */}
          {(isResult || isAnalytics) && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 font-sans text-xs font-medium text-text-sub hover:text-text-main px-3 py-1.5 rounded-xl border border-border-main/70 hover:border-border-main bg-transparent hover:bg-brand-deep/40 transition-all duration-200 cursor-pointer select-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {isResult ? "Scan Lagi" : "Beranda"}
            </button>
          )}

          {!isResult && !isAnalytics && (
            <button
              onClick={() => navigate("/analytics")}
              className="flex items-center gap-1.5 font-sans text-xs font-medium text-text-sub hover:text-text-main px-3 py-1.5 rounded-xl border border-border-main/70 hover:border-border-main bg-transparent hover:bg-brand-deep/40 transition-all duration-200 cursor-pointer select-none"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analitik
            </button>
          )}

          {/* Divider */}
          <div className="w-px h-4 bg-border-main/50" />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded-xl border border-border-main/70 flex items-center justify-center text-text-sub hover:text-text-main hover:border-border-main hover:bg-brand-deep/40 transition-all duration-200 cursor-pointer select-none"
          >
            {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
