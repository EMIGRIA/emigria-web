# Claude Opus Agent Prompt — Emigria Result Page
## Task: Build Result.tsx + All Result Components

---

## WHAT YOU ARE BUILDING

The Result page for **Emigria** — an AI-powered overseas job fraud detection app.

**Layout concept (from design reference):**
- Full-screen dark map (MapLibre GL JS) fills the entire viewport as background
- The map automatically flies to and highlights the destination country detected from the scan
- A fixed right-side panel (~420px wide, full viewport height) overlays the map
- The panel is fully scrollable and contains all fraud analysis details
- On mobile: panel takes full screen (map hidden), user can tap a button to peek at the map

This is NOT a traditional page layout. Think of it like a crime analytics dashboard or
a flight tracker — the map IS the page, the panel floats over it.

---

## EXISTING PROJECT CONTEXT

### Tech stack already in use:
```
React 18 + Vite + TypeScript
Tailwind CSS v4
react-router-dom v6
react-hot-toast
clsx + cva
axios
```

### Existing folder structure (DO NOT restructure):
```
src/
├── components/
│   ├── common/
│   │   ├── LoadingOverlay.tsx
│   │   ├── Navbar.tsx
│   │   └── StatsBanner.tsx
│   └── result/
│       ├── CountryMapVisual.tsx   ← Already exists, needs full rewrite
│       ├── GeoRiskCard.tsx        ← Already exists, needs update
│       ├── RealityCheck.tsx       ← Already exists, may need update
│       ├── SectionNav.tsx         ← Already exists, needs update
│       ├── ShareButton.tsx        ← Already exists
│       └── VerdictCard.tsx        ← Already exists, needs update
├── hooks/
│   ├── useAnalytics.ts
│   └── useScan.ts
├── lib/
│   ├── api.ts
│   └── riskUtils.ts
├── pages/
│   └── Result.tsx                 ← Primary file to rewrite
├── types/
│   └── index.ts
└── utils/
    └── helpers.tsx
```

### Design system tokens (already configured in tailwind.config):
```
brand.green:   #00684A   (primary green)
brand.cta:     #00ED64   (accent — MapLibre highlight color, CTA buttons)
brand.deep:    #001E2B   (page bg, panel bg)
brand.surface: #003D4F   (card bg inside panel)

risk.low:         #059669
risk.medium:      #D97706
risk.high:        #EA580C
risk.critical:    #DC2626
risk.critical-bg: #7F1D1D

font-display: "EB Garamond" (serif)
font-sans:    "Plus Jakarta Sans"
font-mono:    "JetBrains Mono"
```

---

## MAP LIBRARY: MapCN (shadcn for maps)

Docs: https://www.mapcn.dev/docs

**MapCN is shadcn-style copy-paste map components built on MapLibre GL.**
Install by copying the component into the project (no separate npm package):

```bash
npx shadcn@latest add @mapcn/map
```

This installs `maplibre-gl` and copies the map component to `@/components/ui/map`.
The component uses **Carto dark matter tiles by default** — no API key needed.
Dark/light tiles switch automatically based on the OS theme.

### MapCN API (what gets copied into @/components/ui/map):
```ts
// Available exports:
import {
  Map,           // Main map component
  MapMarker,     // DOM-based marker (for a few markers)
  MarkerContent, // Custom marker visual content
  MarkerTooltip, // Hover tooltip
  MarkerPopup,   // Click popup
  MapControls,   // Zoom/compass controls
  useMap,        // Hook: access map instance from child components
  type MapRef,   // Ref type for the Map component
} from "@/components/ui/map"
```

### CountryMapVisual.tsx — Full implementation spec:

```tsx
// This component is the full-screen map background
// Props:
interface CountryMapVisualProps {
  country: string | null      // e.g. "Taiwan", "Malaysia", "Saudi Arabia"
  riskLevel: string | null    // "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}
```

**Step 1 — Country coordinates lookup table (NO geocoding API):**
```ts
const COUNTRY_COORDS: Record<string, [number, number]> = {
  // Southeast Asia
  "Malaysia":     [109.6976,  4.2105],
  "Singapore":    [103.8198,  1.3521],
  "Thailand":     [100.9925, 15.8700],
  "Indonesia":    [113.9213, -0.7893],
  "Philippines":  [121.7740, 12.8797],
  "Vietnam":      [108.2772, 14.0583],
  "Cambodia":     [104.9910, 12.5657],
  "Myanmar":      [ 95.9560, 21.9162],
  // Middle East
  "Saudi Arabia": [ 45.0792, 23.8859],
  "UAE":          [ 53.8478, 23.4241],
  "United Arab Emirates": [53.8478, 23.4241],
  "Qatar":        [ 51.1839, 25.3548],
  "Kuwait":       [ 47.4818, 29.3117],
  "Bahrain":      [ 50.5577, 26.0667],
  "Oman":         [ 57.5522, 21.4735],
  "Jordan":       [ 36.2384, 30.5852],
  // East Asia
  "Taiwan":       [120.9605, 23.6978],
  "Japan":        [138.2529, 36.2048],
  "South Korea":  [127.7669, 35.9078],
  "Hong Kong":    [114.1095, 22.3964],
  "China":        [104.1954, 35.8617],
  // Others
  "Australia":    [133.7751,-25.2744],
  "United States":[-95.7129, 37.0902],
  "United Kingdom":[-3.4360, 55.3781],
  "Germany":      [ 10.4515, 51.1657],
}
```

**Step 2 — Risk level → marker color:**
```ts
const RISK_COLORS: Record<string, string> = {
  LOW:      "#059669",   // risk-low
  MEDIUM:   "#D97706",   // risk-medium
  HIGH:     "#EA580C",   // risk-high
  CRITICAL: "#DC2626",   // risk-critical
}
```

**Step 3 — flyTo using MapRef:**
```tsx
// Access the MapLibre instance via useRef<MapRef>
// On country prop change: flyTo the country coords
// MapCN exposes the underlying MapLibre flyTo via mapRef.current?.flyTo()

import { Map, MapMarker, MarkerContent, type MapRef } from "@/components/ui/map"
import { useRef, useEffect } from "react"

export function CountryMapVisual({ country, riskLevel }: CountryMapVisualProps) {
  const mapRef = useRef<MapRef>(null)
  
  const coords = country
    ? COUNTRY_COORDS[country] ?? null
    : null
  
  const markerColor = RISK_COLORS[riskLevel ?? ""] ?? "#059669"

  // flyTo when country changes
  useEffect(() => {
    if (!coords || !mapRef.current) return
    mapRef.current.flyTo({
      center: coords,
      zoom: 5,
      duration: 2500,
      essential: true,
    })
  }, [country]) // re-run when country prop changes

  return (
    <div className="absolute inset-0 w-full h-full">
      <Map
        ref={mapRef}
        center={coords ?? [0, 20]}   // initial center: country or world
        zoom={coords ? 5 : 2}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        // MapCN uses Carto dark matter by default — no mapStyle prop needed
      >
        {/* Pulse marker at country center */}
        {coords && (
          <MapMarker longitude={coords[0]} latitude={coords[1]}>
            <MarkerContent>
              <PulseMarker color={markerColor} />
            </MarkerContent>
          </MapMarker>
        )}
      </Map>
    </div>
  )
}
```

**Step 4 — PulseMarker custom component:**
```tsx
// Radar ping effect — pulsing expanding ring around a solid dot
// Pure Tailwind + inline style for the animation

function PulseMarker({ color }: { color: string }) {
  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      {/* Outer pulse ring 1 */}
      <span
        className="absolute inline-flex w-14 h-14 rounded-full opacity-75 animate-ping"
        style={{ backgroundColor: color }}
      />
      {/* Outer pulse ring 2 (delayed) */}
      <span
        className="absolute inline-flex w-10 h-10 rounded-full opacity-50"
        style={{
          backgroundColor: color,
          animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s",
        }}
      />
      {/* Inner solid dot */}
      <span
        className="relative inline-flex w-4 h-4 rounded-full border-2 border-white shadow-lg"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}
// Note: Tailwind's built-in `animate-ping` is the expand-fade ring.
// Two rings with offset timing = layered radar effect.
```

**Complete CountryMapVisual.tsx:**
```tsx
"use client" // if Next.js; remove if plain Vite React

import { useRef, useEffect } from "react"
import { Map, MapMarker, MarkerContent, type MapRef } from "@/components/ui/map"

// [paste COUNTRY_COORDS here]
// [paste RISK_COLORS here]
// [paste PulseMarker here]

interface CountryMapVisualProps {
  country: string | null
  riskLevel: string | null
}

export function CountryMapVisual({ country, riskLevel }: CountryMapVisualProps) {
  const mapRef = useRef<MapRef>(null)
  const coords = country ? (COUNTRY_COORDS[country] ?? null) : null
  const markerColor = RISK_COLORS[riskLevel ?? ""] ?? "#059669"

  useEffect(() => {
    if (!coords) return
    // Small delay to ensure map is loaded before flying
    const timer = setTimeout(() => {
      mapRef.current?.flyTo({
        center: coords,
        zoom: 5,
        duration: 2500,
        essential: true,
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [country])

  return (
    <div className="absolute inset-0">
      <Map
        ref={mapRef}
        center={coords ?? [0, 20]}
        zoom={coords ? 4 : 2}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        {coords && (
          <MapMarker longitude={coords[0]} latitude={coords[1]}>
            <MarkerContent>
              <PulseMarker color={markerColor} />
            </MarkerContent>
          </MapMarker>
        )}
      </Map>
    </div>
  )
}
```

---

## RESULT PAGE LAYOUT: Result.tsx

```tsx
// /src/pages/Result.tsx
// Full layout structure:

<div className="relative w-screen h-screen overflow-hidden bg-brand-deep">

  {/* Layer 0: Full-screen map */}
  <CountryMapVisual
    country={geo_risk.country}
    riskLevel={geo_risk.risk_level}
  />

  {/* Layer 1: Right panel */}
  <aside className="
    absolute top-0 right-0
    w-[420px] h-screen
    bg-brand-deep/90 backdrop-blur-md
    border-l border-white/10
    overflow-y-auto
    z-10
    scrollbar-thin
  ">
    <ResultPanel result={result} />
  </aside>

  {/* Layer 2: Mobile toggle (only on < md) */}
  {/* Mobile: panel is full-screen, map hidden */}
  {/* A "Lihat Peta" floating button lets user peek at map */}

</div>
```

**Mobile behavior (< 768px):**
- Panel takes `100vw 100vh` (covers map completely)
- Floating pill button at top: `🗺️ Lihat Peta` 
- Tapping it hides panel temporarily, reveals map for 3 seconds, then panel slides back
- Or: make panel a bottom sheet that slides up, map visible behind it (preferred)

**Desktop behavior (≥ 768px):**
- Map fills left portion, panel fixed on right 420px
- Map is always visible

---

## RIGHT PANEL CONTENT SPEC

The panel is ONE continuous scrollable container. No tabs. Sections flow top to bottom.

### Panel Header (sticky inside panel, not page-level sticky)
```
Navbar-style strip at top of panel:
  Left:  "← Scan Lagi" → navigate('/')
  Right: "Emigria" wordmark (font-display italic text-brand-cta)
  bg-brand-deep/95 sticky top-0 z-20 inside the panel
```

---

### SECTION 1 — VerdictCard (top of panel, most prominent)

```
Color theme: full section background = risk color tinted
  low:      bg-risk-low/10,  border-b border-risk-low/30
  medium:   bg-risk-medium/10, border-b border-risk-medium/30
  high:     bg-risk-high/10, border-b border-risk-high/30
  critical: bg-risk-critical-bg, border-b border-risk-critical
            + criticalPulse on box-shadow

Content:
┌──────────────────────────────────────────┐
│ 🛑  KRITIS — HINDARI          [badge]    │
│                                          │
│ "Lowongan ini memiliki 8 tanda           │
│  penipuan yang serius..."                │
│  (smart_action.summary_text)             │
│  font-sans text-base leading-relaxed     │
│                                          │
│ FRAUD SCORE                              │
│ 87%   (font-mono text-4xl font-bold)     │
│       (ml_fraud_probability * 100)       │
│       — hide entire block if null        │
│                                          │
│ PMI RULE SCORE  (secondary, text-sm)     │
│ 72 / 100   (font-mono)                   │
│       — hide if null                     │
└──────────────────────────────────────────┘

Note: "FRAUD SCORE" label in font-mono text-xs uppercase tracking-widest text-white/50
      The score number is the VISUAL HERO of this section
```

---

### SECTION 2 — Triggered Rules

```
Section label: "ATURAN YANG TERPICU"
(font-mono text-xs uppercase tracking-widest text-white/40)
Divider line above

If triggered_rules.length > 0:
  Wrap flex row of chips:
  Each chip: font-mono text-xs, bg-risk-high/10, text-risk-high,
             border border-risk-high/30, rounded-full px-3 py-1

If empty:
  Single chip: "✓ Tidak ada aturan yang terpicu"
  bg-risk-low/10 text-risk-low border-risk-low/30
```

---

### SECTION 3 — Risk Signals

```
Section label: "SINYAL BAHAYA"

2-column grid (gap-2):
Each signal row:
  [status icon] [label]
  
  danger=true:  🚨 red text, bg-risk-high/5
  warning=true: ⚠️ amber text, bg-risk-medium/5
  false:        ○  text-white/20 (muted, still visible)
  good=true:    ✓  text-risk-low

Signal → ID label mapping:
  asks_upfront_payment     → "Bayaran di Muka"
  mentions_tourist_visa    → "Pakai Visa Turis"
  mentions_pilgrimage_visa → "Visa Umroh/Haji"
  asks_for_passport        → "Minta Paspor"
  promises_fast_process    → "Proses Cepat"
  promises_high_salary     → "Gaji Sangat Tinggi"
  uses_personal_contact    → "Kontak Personal"
  salary_claim_unrealistic → "Gaji Tidak Masuk Akal"
  company_identity_clear   → "Identitas Jelas" ← GOOD if true

Urgency level (below grid):
  Row: "URGENSI" label + pills [Rendah] [Sedang] [Tinggi]
  Active pill: bg-risk-[level] text-white
  Inactive: bg-white/5 text-white/30

Risk keywords (only if risk_keywords.length > 0):
  "KATA KUNCI TERDETEKSI"
  Amber chips: each keyword font-mono text-xs
```

---

### SECTION 4 — Reality Check (Salary)

```
Section label: "KEWAJARAN GAJI"
Right-aligned verdict: "✓ Wajar" or "✗ Tidak Wajar" (small badge)

If offered_salary_idr !== null:

  "GAJI DITAWARKAN"
  Rp 13.000.000   ← formatIDR, font-mono text-2xl font-bold

  "STANDAR GAJI NEGARA TERKAIT"
  Rp 10.685.405 — Rp 16.028.108   ← min – max, font-mono text-sm

  Visual comparison bar:
  ┌────────────────────────────────────────┐
  │  [offered bar]  vs  [standard range]   │
  │  ████████████░░░░░░░░░░░░░░░░░░░░░    │
  │  offered           min        max      │
  └────────────────────────────────────────┘
  Implementation:
    - Calculate positions as % of max(offered, standard_max) * 1.2
    - Offered: solid bar, color = salary_is_realistic ? risk-low : risk-high
    - Standard range: lighter bg, shows min-to-max span
    - All bars height: 8px, rounded-full

  Flag message (if flag !== null):
  Amber callout: ⚠️ flag text, text-sm, bg-risk-medium/10 rounded-lg p-3

If offered_salary_idr === null:
  Muted card: "💰 Data gaji tidak tersedia"
  text-white/30, bg-white/3
```

---

### SECTION 5 — Geo Risk

```
Section header:
  Left:  "RISIKO GEOGRAFIS" label
  Right: Risk badge (LOW/MEDIUM/HIGH/CRITICAL)

Country name: font-display italic text-3xl (e.g. "Taiwan")
If null: "Negara Tidak Terdeteksi" text-white/30

Data grid (2-column, font-mono):
  CRIME INDEX          TINGKAT
  1.71  ↓-0.01         LOW [badge]

  PERINGKAT KRIMINALITAS
  #7 (regional) / #144 (global)
  → Only show if crime_index not null
  → Only show if fraud_rate not null: "Tingkat Penipuan: XX%"

Crime index trend mini-chart (if crime_index available):
  Simple SVG sparkline — show 2 data points (previous year vs current)
  Green line going down = good, red going up = bad
  X-axis: year labels (font-mono text-xs)
  Height: 80px, width: full panel width minus padding

KBRI block (if nearest_kbri not null):
  bg-brand-surface rounded-xl p-4 mt-3
  🏛️ KBRI TERDEKAT
  nearest_kbri text (font-sans font-semibold)
  kbri_distance_note (text-sm text-white/60)
```

---

### SECTION 6 — Share (bottom of panel)

```
Section label: "BAGIKAN LAPORAN"
Subtext: "Bantu lindungi orang-orang terdekat dari penipuan kerja luar negeri."
font-sans text-sm text-white/60

Buttons (side by side):
  [📱 WhatsApp]        [🔗 Salin Tautan]
  bg-[#25D366]         bg-brand-surface
  text-white           text-white
  font-sans font-semibold text-sm

WhatsApp:
  href = `https://wa.me/?text=${encodeURIComponent(share_text + "\n\n" + url)}`
  target="_blank"

Salin Tautan:
  onClick: navigator.clipboard.writeText(url)
  toast.success("Tautan disalin!")
  
If navigator.share available: replace both with single
  [↗ Bagikan Hasil Ini] primary button (full width)
  then WhatsApp as secondary below
```

---

## COMPONENT FILE SPECS

### CountryMapVisual.tsx (FULL REWRITE)
```
- react-map-gl Map component, full screen absolute
- mapStyle: https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json
- initialViewState: { longitude: 0, latitude: 20, zoom: 2 }
- On country prop change: flyTo() the country coords
- Custom HTML Marker with pulse animation at country center
- Marker color = riskLevel color token
- No controls (no zoom buttons, no compass)
- Disable scroll zoom when panel is in focus
- attributionControl: false (clean map)
```

### VerdictCard.tsx (UPDATE)
```
Props: verdict, smart_action
Renders: risk badge, summary_text, fraud score, pmi score
Handles: null probability, null pmi_rule_score
Applies: criticalPulse animation when risk_level === "critical"
```

### GeoRiskCard.tsx (UPDATE)
```
Props: geo_risk
Renders: country name, risk badge, crime index grid,
         crime trend sparkline (SVG), KBRI block
Handles: all null fields gracefully
NOTE: does NOT render the map — CountryMapVisual is separate
```

### RealityCheck.tsx (UPDATE)
```
Props: reality_check
Renders: salary display, comparison bar, flag callout
Handles: offered_salary_idr === null → muted card
```

### ShareButton.tsx (UPDATE)
```
Props: smart_action
Renders: WhatsApp + Copy Link buttons (or native Share)
Uses: Native Share API with clipboard fallback
```

### SectionNav.tsx (UPDATE)
```
This component is NOT needed as a sticky nav in this layout.
Instead: repurpose as scroll progress indicator on the panel,
OR: keep as hidden and remove from Result.tsx entirely.
The panel itself scrolls, so anchor navigation is less critical.
If keeping: render as small dot indicators on panel right edge,
            each dot represents a section, active dot = current scroll position.
```

---

## Result.tsx FULL IMPLEMENTATION GUIDE

```tsx
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import CountryMapVisual from '@/components/result/CountryMapVisual'
// ... other imports

export default function Result() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const result = state?.result
  
  // Guard: no state = redirect home
  if (!result) return <Navigate to="/" replace />

  const { verdict, triggered_rules, risk_signals,
          reality_check, geo_risk, smart_action } = result

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-brand-deep">
      
      {/* Full-screen map — desktop only visible */}
      <div className="hidden md:block absolute inset-0 z-0">
        <CountryMapVisual
          country={geo_risk?.country ?? null}
          riskLevel={geo_risk?.risk_level ?? null}
        />
      </div>

      {/* Right panel */}
      <aside
        className="
          absolute right-0 top-0
          w-full md:w-[420px]
          h-screen
          overflow-y-auto
          bg-brand-deep/95 md:bg-brand-deep/90
          backdrop-blur-xl
          border-l border-white/10
          z-10
        "
      >
        {/* Sticky panel header */}
        <div className="sticky top-0 z-20 flex items-center justify-between
                        px-5 py-4 bg-brand-deep/95 backdrop-blur-md
                        border-b border-white/10">
          <button
            onClick={() => navigate('/')}
            className="font-sans text-sm text-white/60 hover:text-white
                       flex items-center gap-1.5 transition-colors"
          >
            ← Scan Lagi
          </button>
          <span className="font-display italic text-brand-cta text-xl">
            Emigria
          </span>
        </div>

        {/* Scrollable sections */}
        <div className="flex flex-col divide-y divide-white/5">
          
          {/* Section 1: Verdict */}
          <section className="p-5">
            <VerdictCard verdict={verdict} smartAction={smart_action} />
          </section>

          {/* Section 2: Triggered Rules */}
          <section className="p-5">
            <TriggeredRules rules={triggered_rules} />
          </section>

          {/* Section 3: Risk Signals */}
          <section className="p-5">
            <RiskSignalList signals={risk_signals} />
          </section>

          {/* Section 4: Reality Check */}
          <section className="p-5">
            <RealityCheck data={reality_check} />
          </section>

          {/* Section 5: Geo Risk */}
          <section className="p-5">
            <GeoRiskCard data={geo_risk} />
          </section>

          {/* Mobile: Show map peek button */}
          <div className="md:hidden p-5">
            <MobileMapPeek country={geo_risk?.country} riskLevel={geo_risk?.risk_level} />
          </div>

          {/* Section 6: Share */}
          <section className="p-5 pb-10">
            <ShareButton smartAction={smart_action} />
          </section>
          
        </div>
      </aside>

    </div>
  )
}
```

---

## MOBILE MAP PEEK (bonus component)

```tsx
// MobileMapPeek.tsx
// Shows a mini preview of the map on mobile
// A tappable card that expands to full-screen map overlay

function MobileMapPeek({ country, riskLevel }) {
  const [open, setOpen] = useState(false)
  
  if (!country) return null
  
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 p-4
                   bg-brand-surface rounded-xl border border-white/10
                   font-sans text-sm text-white/70 hover:text-white
                   transition-colors"
      >
        🗺️ Lihat lokasi {country} di peta
        <span className="ml-auto text-white/30">→</span>
      </button>
      
      {open && (
        <div className="fixed inset-0 z-50 bg-brand-deep">
          <CountryMapVisual country={country} riskLevel={riskLevel} />
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-10
                       bg-brand-deep/80 backdrop-blur-sm
                       px-4 py-2 rounded-full
                       font-sans text-sm text-white
                       border border-white/20"
          >
            ✕ Tutup Peta
          </button>
        </div>
      )}
    </>
  )
}
```

---

## CSS ADDITIONS (add to index.css)

```css
/* Panel scrollbar — thin and dark */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #003D4F transparent;
}
.scrollbar-thin::-webkit-scrollbar { width: 4px; }
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #003D4F;
  border-radius: 2px;
}

/* Map pulse marker */
@keyframes mapPulse {
  0%   { transform: scale(1);   opacity: 0.8; }
  70%  { transform: scale(3);   opacity: 0; }
  100% { transform: scale(1);   opacity: 0; }
}

/* Critical verdict */
@keyframes critPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
  50%     { box-shadow: 0 0 0 16px rgba(220,38,38,0); }
}
.critical-pulse { animation: critPulse 2s ease-in-out infinite; }
```

---

## SPARKLINE COMPONENT (for crime trend in GeoRiskCard)

```tsx
// Simple SVG sparkline — no library needed
function Sparkline({ values, color = "#00ED64" }) {
  if (!values || values.length < 2) return null
  
  const w = 280, h = 70
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  
  const points = values.map((v, i) => [
    (i / (values.length - 1)) * w,
    h - ((v - min) / range) * (h - 10) - 5
  ])
  
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`)
    .join(" ")
  
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={color} />
      ))}
    </svg>
  )
}
// Usage in GeoRiskCard:
// Pass [previousCrimeIndex, currentCrimeIndex] as values
// Color: green if trending down, red if trending up
```

---

## API DATA REMINDER

All data comes from router state. Access pattern in Result.tsx:
```ts
const { state } = useLocation()
const result: ScanResult = state?.result
```

ScanResult type (in types/index.ts — update this):
```ts
export interface ScanResult {
  verdict: {
    risk_level: "low" | "medium" | "high" | "critical"
    ml_fraud_probability: number | null
    pmi_rule_score: number | null
  }
  triggered_rules: string[]
  risk_signals: {
    mentions_tourist_visa: boolean
    mentions_pilgrimage_visa: boolean
    asks_for_passport: boolean
    asks_upfront_payment: boolean
    promises_fast_process: boolean
    promises_high_salary: boolean
    uses_personal_contact: boolean
    company_identity_clear: boolean
    salary_claim_unrealistic: boolean
    urgency_level: "low" | "medium" | "high"
    risk_keywords: string[]
  }
  reality_check: {
    offered_salary_idr: number | null
    standard_min_idr: number | null
    standard_max_idr: number | null
    salary_is_realistic: boolean | null
    flag: string | null
  }
  geo_risk: {
    country: string | null
    risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    fraud_rate: number | null
    nearest_kbri: string | null
    kbri_distance_note: string | null
    crime_index: number | null
  }
  smart_action: {
    summary_text: string
    share_text: string
  }
}
```

---

## EDGE CASES — HANDLE ALL

| Condition | Behavior |
|---|---|
| `geo_risk.country === null` | Map stays at world view, no marker |
| `ml_fraud_probability === null` | Hide FRAUD SCORE block entirely |
| `pmi_rule_score === null` | Hide PMI RULE SCORE block entirely |
| `triggered_rules` is `[]` | Green chip "✓ Tidak ada aturan yang terpicu" |
| `risk_keywords` is `[]` | Hide keywords section entirely |
| `offered_salary_idr === null` | Muted "Data gaji tidak tersedia" card |
| `salary_is_realistic === null` | Hide verdict chip |
| `flag === null` | Hide flag callout |
| `nearest_kbri === null` | Hide KBRI block |
| `fraud_rate === null` | Hide fraud rate row |
| `crime_index === null` | Hide crime index + sparkline |
| No router state | `<Navigate to="/" replace />` |
| MapLibre load error | Graceful: hide map, panel still works |
| Country not in coords lookup | Map stays at world view, no crash |

---

## IMPLEMENTATION ORDER

```
1. npx shadcn@latest add @mapcn/map  (installs maplibre-gl + copies map component)
2. types/index.ts — add ScanResult interface
3. lib/riskUtils.ts — verify getRiskColor, formatIDR, formatPct exist
4. CountryMapVisual.tsx — full rewrite with MapLibre + flyTo + pulse marker
5. VerdictCard.tsx — update with new layout (fraud score hero)
6. TriggeredRules.tsx — create if not exists
7. RiskSignalList.tsx — create if not exists (split from VerdictCard)
8. RealityCheck.tsx — update with comparison bar
9. GeoRiskCard.tsx — update with sparkline, remove map (CountryMapVisual handles it)
10. ShareButton.tsx — update buttons
11. Result.tsx — full rewrite with map+panel layout
12. MobileMapPeek.tsx — mobile map access
13. index.css — add scrollbar-thin, mapPulse, critPulse
```

---

## DO NOT

- Do not add routing or auth logic
- Do not modify Home.tsx or any scan/ components
- Do not install Mapbox (requires API key)
- Do not install react-map-gl or react-leaflet — use MapCN only
- Do not write `npm install maplibre-gl` — MapCN's npx command handles it
- Do not import map components from anywhere other than `@/components/ui/map`
- Do not put the map inside the right panel — it is a BACKGROUND layer
- Do not add a SectionNav sticky bar — the panel itself scrolls
- Do not use localStorage
- All UI text must remain in Bahasa Indonesia
