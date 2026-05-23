import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MAP_COORDINATES: Record<string, { lat: number; lng: number; zoom: number; label: string; nameIndonesian: string }> = {
  taiwan: { lat: 23.6978, lng: 120.9605, zoom: 6, label: "KDEI Taipei", nameIndonesian: "Taiwan" },
  malaysia: { lat: 4.2105, lng: 101.9758, zoom: 5, label: "KBRI Kuala Lumpur", nameIndonesian: "Malaysia" },
  singapore: { lat: 1.3521, lng: 103.8198, zoom: 10, label: "KBRI Singapore", nameIndonesian: "Singapura" },
  "saudi arabia": { lat: 23.8859, lng: 45.0792, zoom: 4.5, label: "KBRI Riyadh", nameIndonesian: "Arab Saudi" },
  "hong kong": { lat: 22.3193, lng: 114.1694, zoom: 9.5, label: "KJRI Hong Kong", nameIndonesian: "Hong Kong" },
  japan: { lat: 36.2048, lng: 138.2529, zoom: 4.5, label: "KBRI Tokyo", nameIndonesian: "Jepang" },
  "south korea": { lat: 35.9078, lng: 127.7669, zoom: 5.5, label: "KBRI Seoul", nameIndonesian: "Korea Selatan" },
  qatar: { lat: 25.3548, lng: 51.1839, zoom: 7.5, label: "KBRI Doha", nameIndonesian: "Qatar" },
  uae: { lat: 23.4241, lng: 53.8478, zoom: 6.5, label: "KBRI Abu Dhabi", nameIndonesian: "Uni Emirat Arab" },
  kuwait: { lat: 29.3759, lng: 47.9774, zoom: 8, label: "KBRI Kuwait", nameIndonesian: "Kuwait" },
  cambodia: { lat: 12.5657, lng: 104.9910, zoom: 6, label: "KBRI Phnom Penh", nameIndonesian: "Kamboja" },
  myanmar: { lat: 21.9162, lng: 95.9560, zoom: 5.5, label: "KBRI Yangon", nameIndonesian: "Myanmar" },
  laos: { lat: 19.8563, lng: 102.4955, zoom: 5.5, label: "KBRI Vientiane", nameIndonesian: "Laos" }
};

const normalizeCountryKey = (countryName: string): string => {
  const c = countryName.toLowerCase().trim();
  if (c.includes("taiwan")) return "taiwan";
  if (c.includes("malaysia")) return "malaysia";
  if (c.includes("singapor") || c.includes("singapur")) return "singapore";
  if (c.includes("saudi") || c.includes("arab saudi")) return "saudi arabia";
  if (c.includes("hong") || c.includes("hongkong")) return "hong kong";
  if (c.includes("japan") || c.includes("jepang")) return "japan";
  if (c.includes("korea") || c.includes("south korea")) return "south korea";
  if (c.includes("qatar")) return "qatar";
  if (c.includes("uae") || c.includes("emirat") || c.includes("uni emirat arab")) return "uae";
  if (c.includes("kuwait")) return "kuwait";
  if (c.includes("cambodia") || c.includes("kamboja")) return "cambodia";
  if (c.includes("myanmar")) return "myanmar";
  if (c.includes("laos")) return "laos";
  return "";
};

interface CountryMapVisualProps {
  countryName: string;
  riskLevel: string;
}

export default function CountryMapVisual({ countryName, riskLevel }: CountryMapVisualProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const normalizedKey = normalizeCountryKey(countryName);
  const mapInfo = MAP_COORDINATES[normalizedKey];

  // Colors based on risk
  const getRiskColor = (level: string) => {
    const l = level.toLowerCase();
    if (l === "low") return "var(--risk-low)";
    if (l === "medium") return "var(--risk-medium)";
    return "var(--risk-high)";
  };

  const riskColor = getRiskColor(riskLevel);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Detect if dark mode is active
    const isDark = document.documentElement.classList.contains("dark") || 
                   document.body.classList.contains("dark");
    const styleUrl = isDark 
      ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

    const coords = mapInfo || { lat: 20, lng: 0, zoom: 2 };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [coords.lng, coords.lat],
      zoom: coords.zoom,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
    });

    mapRef.current = map;

    // Custom pulse marker
    const markerEl = document.createElement("div");
    markerEl.className = "custom-map-marker";
    markerEl.innerHTML = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-6 h-6 rounded-full animate-ping opacity-30" style="background-color: ${riskColor}"></div>
        <div class="relative w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 shadow-md" style="background-color: ${riskColor}"></div>
      </div>
    `;

    const marker = new maplibregl.Marker({ element: markerEl })
      .setLngLat([coords.lng, coords.lat])
      .addTo(map);

    markerRef.current = marker;

    // Watch for theme changes dynamically
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark") || 
                     document.body.classList.contains("dark");
      const updatedStyle = dark 
        ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
      map.setStyle(updatedStyle);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      map.remove();
    };
  }, []);

  // Animate changes to country/coordinates
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapInfo) return;

    map.flyTo({
      center: [mapInfo.lng, mapInfo.lat],
      zoom: mapInfo.zoom,
      essential: true,
      duration: 1600,
    });

    if (markerRef.current) {
      markerRef.current.setLngLat([mapInfo.lng, mapInfo.lat]);
      // Update marker element color if riskLevel changes
      const markerEl = markerRef.current.getElement();
      const pingEl = markerEl.querySelector(".animate-ping") as HTMLDivElement;
      const dotEl = markerEl.querySelector(".rounded-full:not(.animate-ping)") as HTMLDivElement;
      if (pingEl) pingEl.style.backgroundColor = riskColor;
      if (dotEl) dotEl.style.backgroundColor = riskColor;
    }
  }, [normalizedKey, riskColor]);

  if (!mapInfo) {
    return (
      <div className="w-full h-full bg-brand-deep/30 rounded-lg border border-border-main/50 flex items-center justify-center">
        <p className="font-sans text-xs text-text-sub/50">Peta tidak tersedia untuk {countryName}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-brand-deep/30 rounded-lg border border-border-main/50 overflow-hidden flex items-center justify-center select-none shadow-inner">
      {/* Container where MapLibre renders */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />

      {/* Modern Minimalist HUD Overlays */}
      {/* Embassy Tag */}
      <div className="absolute top-2.5 right-3 flex items-center gap-1 bg-brand-surface/85 backdrop-blur-xs px-2 py-0.5 rounded border border-border-main/30 text-[9px] font-mono font-medium text-text-main shadow-sm pointer-events-none z-10 select-none">
        <MapPin className="w-2 h-2 text-brand-green" />
        <span>{mapInfo.label}</span>
      </div>
    </div>
  );
}
