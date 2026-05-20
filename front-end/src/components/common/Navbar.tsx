import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { BarChart3 } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isResult = location.pathname === "/result";
  const isAnalytics = location.pathname === "/analytics";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-brand-deep/90 border-b border-border-main px-4 py-3 transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div
          onClick={() => navigate("/")}
          className="font-display italic text-2xl font-bold text-brand-green cursor-pointer hover:opacity-80 transition-opacity"
        >
          Emigria
        </div>
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full border border-border-main text-text-main hover:bg-brand-surface hover:text-brand-green transition-all cursor-pointer flex items-center justify-center select-none"
          >
            {theme === "light" ? (
              // Moon icon for switching to dark
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            ) : (
              // Sun icon for switching to light
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21M5.8 18.2l-1.58 1.58M18.2 5.8l-1.58 1.58M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                />
              </svg>
            )}
          </button>

          {isResult && (
            <button
              onClick={() => navigate("/")}
              className="text-xs font-sans font-medium text-text-sub hover:text-brand-green border border-border-main hover:border-brand-green/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer bg-brand-deep"
            >
              ← Scan Lagi
            </button>
          )}
          {!isResult && !isAnalytics && (
            <button
              onClick={() => navigate("/analytics")}
              className="text-xs font-sans font-medium text-text-sub hover:text-brand-green border border-border-main hover:border-brand-green/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer bg-brand-deep flex items-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analitik</span>
            </button>
          )}
          {isAnalytics && (
            <button
              onClick={() => navigate("/")}
              className="text-xs font-sans font-medium text-text-sub hover:text-brand-green border border-border-main hover:border-brand-green/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer bg-brand-deep"
            >
              ← Beranda
            </button>
          )}
        </div>
      </div>
    </nav>

  );
}
