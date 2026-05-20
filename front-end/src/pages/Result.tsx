import { useState, useEffect, useRef } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import VerdictCard from "../components/result/VerdictCard";
import SectionNav from "../components/result/SectionNav";
import TriggeredRules from "../components/result/TriggeredRules";
import RiskSignalList from "../components/result/RiskSignalList";
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
    triggered_rules,
    risk_signals,
    reality_check,
    geo_risk,
    smart_action,
  } = result;

  return (
    <div className="min-h-screen bg-brand-deep flex flex-col pb-20 transition-colors duration-300">
      <Navbar />

      {/* Scrollable analysis content */}
      <main className="flex-1 px-4 py-5 max-w-2xl mx-auto w-full space-y-3">
        {/* A - Sticky Section Nav (appears after VerdictCard exits) */}
        <SectionNav />

        {/* B - Hero Verdict Card */}
        <VerdictCard verdict={verdict} summaryText={smart_action.summary_text} />

        {/* C - Triggered Rules */}
        <RevealSection id="aturan">
          <TriggeredRules rules={triggered_rules} />
        </RevealSection>

        {/* D - Risk Signals Checklist */}
        <RevealSection id="sinyal">
          <RiskSignalList signals={risk_signals} />
        </RevealSection>

        {/* E - Salary Reality Check */}
        <RevealSection id="gaji">
          <RealityCheck realityCheck={reality_check} />
        </RevealSection>

        {/* F - Geographical Risk */}
        <RevealSection id="geo">
          <GeoRiskCard geoRisk={geo_risk} />
        </RevealSection>

        {/* G - Actionable Sharing CTA */}
        <RevealSection id="bagikan">
          <ShareButton shareText={smart_action.share_text} />
        </RevealSection>
      </main>
    </div>
  );
}
