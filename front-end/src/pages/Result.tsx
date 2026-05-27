import { useState, useEffect, useRef } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import VerdictCard from "../components/result/VerdictCard";
import OfficialDataStickyNote from "../components/result/OfficialDataStickyNote";
import GeoRiskCard from "../components/result/GeoRiskCard";
import RealityCheck from "../components/result/RealityCheck";
import ShareButton from "../components/result/ShareButton";

// Custom reveal animation hook
function useReveal() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.12 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return { ref, visible };
}

// Reveal Wrapper Component to make JSX clean
function RevealSection({ children, id }: { children: React.ReactNode; id?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      id={id}
      className={`transition-all duration-700 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {children}
    </div>
  );
}

export default function Result() {
  const location = useLocation();
  const result = location.state?.result;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Safe navigation if no result data is present in router state
  if (!result) {
    return <Navigate to="/" replace />;
  }

  const {
    verdict,
    reality_check,
    geo_risk,
    smart_action,
    triggered_rules,
  } = result;

  // Normalize geo_risk to always be an array (backend now returns array,
  // but this also handles legacy single-object responses gracefully)
  const geoRisks = Array.isArray(geo_risk) ? geo_risk : [geo_risk];

  return (
    <div className="min-h-screen bg-brand-deep flex flex-col pb-10 lg:pb-6 transition-colors duration-300">
      <Navbar />

      {/* Scrollable analysis content */}
      <main className="flex-1 px-4 md:px-8 py-4 md:py-6 lg:pt-8 lg:pb-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Dashboard Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column - Main Verdict, Salary & Actions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* B - Hero Verdict Card */}
            <VerdictCard
              verdict={verdict}
              summaryText={smart_action.summary_text}
              triggeredRules={triggered_rules}
            />

            {/* E - Salary Reality Check */}
            <RevealSection id="gaji">
              <RealityCheck realityCheck={reality_check} />
            </RevealSection>

            {/* G - Actionable Sharing CTA (Desktop only) + Sticky Note */}
            <div className="hidden lg:flex flex-col gap-6">
              <RevealSection id="bagikan">
                <ShareButton shareText={smart_action.share_text} />
              </RevealSection>
              
              <RevealSection id="official-data">
                <OfficialDataStickyNote geoRisks={geoRisks} />
              </RevealSection>
            </div>
          </div>

          {/* Right Column - Geography & In-depth Analytics (Sticky on Desktop) */}
          <div className="lg:col-span-7 lg:sticky lg:top-20 self-start transition-all duration-300">
            {/* F - Geographical Risk (supports multi-country carousel) */}
            <RevealSection id="geo">
              <GeoRiskCard geoRisks={geoRisks} />
            </RevealSection>

            {/* G - Actionable Sharing CTA (Mobile only - placed after geo risk) + Sticky Note */}
            <div className="block lg:hidden mt-6 space-y-6">
              <RevealSection id="bagikan-mobile">
                <ShareButton shareText={smart_action.share_text} />
              </RevealSection>

              <RevealSection id="official-data-mobile">
                <OfficialDataStickyNote geoRisks={geoRisks} />
              </RevealSection>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
