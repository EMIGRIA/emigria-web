# Antigravity Prompt — Emigria Frontend

> Model: gemini-3.5-flash | Stack: React + Vite + Tailwind CSS v4 + shadcn/ui

---

## CONTEXT

You are building the **frontend** for **Emigria** — an AI-powered overseas job fraud detection app
for Indonesian Migrant Workers (PMI) and the general public. The backend is already complete.

**Core value prop:** Zero friction. Upload a job brochure photo, paste text, or a URL →
get instant fraud risk analysis. No login. No register. Mobile-first.

---

## DESIGN SYSTEM (HYBRID)

You are given **two DESIGN.md files** as attached context:

1. **CLAUDEDESIGN.md** — Use ONLY for **typography**:
   - Display/headings: `"EB Garamond"` (Google Fonts) — editorial, authoritative
   - Body/UI: `"Plus Jakarta Sans"` (Google Fonts) — humanist, readable on mobile
   - Data/numbers: `"JetBrains Mono"` (Google Fonts) — scores, percentages
   - Do NOT use Claude's color palette

2. **MONGODESIGN.md** — Use ONLY for **color palette**:
   - Primary green: `#00684A`
   - CTA accent: `#00ED64` (sparingly — primary button only)
   - Dark surface: `#001E2B` (page background, navbar)
   - Mid surface: `#003D4F` (cards, panels)
   - Do NOT use MongoDB's typography

### Semantic Risk Color Tokens

```
risk-low:              #059669
risk-medium:           #D97706
risk-high:             #EA580C
risk-critical:         #DC2626
risk-critical-bg:      #7F1D1D
```

### Tailwind v4 Config

```js
export default {
  theme: {
    extend: {
      fontFamily: {
        display: ["EB Garamond", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          green: "#00684A",
          cta: "#00ED64",
          deep: "#001E2B",
          surface: "#003D4F",
        },
        risk: {
          low: "#059669",
          medium: "#D97706",
          high: "#EA580C",
          critical: "#DC2626",
          "critical-bg": "#7F1D1D",
        },
      },
    },
  },
};
```

Google Fonts in index.html:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

---

## TECH STACK

```
React 18 + Vite 5
Tailwind CSS v4
shadcn/ui       — Dialog, Tooltip only
react-router-dom v6
react-hot-toast
clsx + cva
axios
```

---

## API RESPONSE SCHEMA

Exact JSON the backend sends. Build all components around these fields only.

```json
{
  "verdict": {
    "risk_level": "low | medium | high | critical",
    "ml_fraud_probability": "number (0-1) | null",
    "pmi_rule_score": "number | null"
  },
  "triggered_rules": ["string"],
  "risk_signals": {
    "mentions_tourist_visa": "boolean",
    "mentions_pilgrimage_visa": "boolean",
    "asks_for_passport": "boolean",
    "asks_upfront_payment": "boolean",
    "promises_fast_process": "boolean",
    "promises_high_salary": "boolean",
    "uses_personal_contact": "boolean",
    "company_identity_clear": "boolean",
    "salary_claim_unrealistic": "boolean",
    "urgency_level": "low | medium | high",
    "risk_keywords": ["string"]
  },
  "reality_check": {
    "offered_salary_idr": "number | null",
    "standard_min_idr": "number | null",
    "standard_max_idr": "number | null",
    "salary_is_realistic": "boolean | null",
    "flag": "string | null"
  },
  "geo_risk": {
    "country": "string | null",
    "risk_level": "LOW | MEDIUM | HIGH | CRITICAL",
    "fraud_rate": "number | null",
    "nearest_kbri": "string | null",
    "kbri_distance_note": "string | null",
    "crime_index": "number | null"
  },
  "smart_action": {
    "summary_text": "string",
    "share_text": "string"
  }
}
```

### Field Priority

| Field                                 | Priority | Notes                                   |
| ------------------------------------- | -------- | --------------------------------------- |
| `verdict.risk_level`                  | CRITICAL | Drives all color + label + severity UX  |
| `smart_action.summary_text`           | CRITICAL | Human-readable verdict — always show    |
| `verdict.ml_fraud_probability`        | HIGH     | AI confidence — primary number for user |
| `triggered_rules[]`                   | HIGH     | Proof of verdict                        |
| `risk_signals` (boolean set)          | HIGH     | Most impactful visual for PMI           |
| `risk_signals.urgency_level`          | HIGH     | Context for warning severity            |
| `geo_risk.country` + `risk_level`     | HIGH     | Where + how dangerous                   |
| `geo_risk.nearest_kbri`               | HIGH     | Actionable safety info                  |
| `reality_check` (salary)              | MEDIUM   | Concrete salary proof                   |
| `smart_action.share_text`             | MEDIUM   | Share / WhatsApp                        |
| `verdict.pmi_rule_score`              | LOW      | Secondary number below probability      |
| `risk_signals.risk_keywords[]`        | LOW      | Show chips only if array not empty      |
| `geo_risk.fraud_rate` + `crime_index` | LOW      | Show if not null, hide otherwise        |

---

## PROJECT STRUCTURE

```
src/
├── components/
│   ├── scan/
│   │   ├── ScanInput.jsx       # Tab controller: image / text / url
│   │   ├── ImageDropzone.jsx   # Drag & drop / file picker
│   │   └── ScanButton.jsx      # Animated CTA
│   ├── result/
│   │   ├── VerdictCard.jsx     # Hero — risk level + scores + summary
│   │   ├── SectionNav.jsx      # Sticky anchor nav pills
│   │   ├── TriggeredRules.jsx  # Chip list of fired rules
│   │   ├── RiskSignalList.jsx  # Boolean checklist grid
│   │   ├── RealityCheck.jsx    # Salary comparison bar
│   │   ├── GeoRiskCard.jsx     # Country risk + KBRI
│   │   └── ShareButton.jsx     # Native Share + WhatsApp fallback
│   └── common/
│       ├── Navbar.jsx
│       ├── LoadingOverlay.jsx
│       └── StatsBanner.jsx
├── pages/
│   ├── Home.jsx
│   ├── Result.jsx
│   └── Analytics.jsx           # Build last
├── hooks/
│   ├── useScan.js
│   └── useAnalytics.js
└── lib/
    ├── api.js
    └── riskUtils.js
```

---

## lib/riskUtils.js — Implement First

```js
export const getRiskColor = (level) =>
  ({
    low: "text-risk-low bg-risk-low/10 border-risk-low/30",
    medium: "text-risk-medium bg-risk-medium/10 border-risk-medium/30",
    high: "text-risk-high bg-risk-high/10 border-risk-high/30",
    critical: "text-white bg-risk-critical-bg border-risk-critical",
  })[level?.toLowerCase()] ?? "text-white/40 bg-white/5 border-white/10";

export const getRiskLabel = (level) =>
  ({
    low: "Risiko Rendah",
    medium: "Risiko Sedang",
    high: "Risiko Tinggi",
    critical: "KRITIS — Hindari",
  })[level?.toLowerCase()] ?? "Tidak Diketahui";

export const getRiskIcon = (level) =>
  ({
    low: "✅",
    medium: "⚠️",
    high: "🚨",
    critical: "🛑",
  })[level?.toLowerCase()] ?? "❓";

export const formatIDR = (amount) =>
  amount != null
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(amount)
    : null;

export const formatPct = (prob) =>
  prob != null ? `${Math.round(prob * 100)}%` : null;
```

---

## lib/api.js

```js
import axios from "axios";
const api = axios.create({ baseURL: "", timeout: 30000 });
export default api;
// Vite proxy routes /api → localhost:3000, no CORS issues
```

---

## hooks/useScan.js

```js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

export function useScan() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const scan = async ({ mode, file, text, url }) => {
    setLoading(true);
    try {
      let response;

      if (mode === "image") {
        const fd = new FormData();
        fd.append("image", file);
        response = await api.post("/api/scan", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.post(
          "/api/scan",
          mode === "text" ? { text } : { url },
        );
      }

      // Pass result via router state — no re-fetch needed
      navigate("/result", { state: { result: response.data } });
    } catch (err) {
      toast.error(
        err.response?.data?.message ?? "Terjadi kesalahan. Periksa koneksi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return { scan, loading };
}
```

---

## PAGE SPECS

### 1. Home Page (/)

Layout: bg-brand-deep, max-w-md mobile centered, max-w-2xl desktop.

```
[Navbar]

[Hero]
  Headline (font-display, 2.5rem mobile → 3.5rem desktop):
  "Cek Lowongan Kerja Luar Negeri Sebelum Terlambat"

  Sub (font-sans text-white/60):
  "Deteksi penipuan berbasis AI. Gratis. Tanpa daftar."

[Scan Card — bg-brand-surface rounded-2xl p-6]

  Tab bar: [📷 Foto Brosur]  [📝 Tempel Teks]  [🔗 Paste URL]

  Tab image:  ImageDropzone — drag & drop, click to pick (image/*)
              thumbnail preview after selection
  Tab text:   textarea min-h-40, placeholder "Tempel isi lowongan..."
  Tab url:    input[type=url], placeholder "https://..."

  [Analisis Sekarang →]
    Normal:  bg-brand-green text-white
    Hover:   bg-brand-cta text-brand-deep, translateY(-1px)
    Loading: spinner + "Menganalisis..." + disabled

[StatsBanner — font-mono text-xs text-white/40]
  "🔍 X.XXX dianalisis  |  🚨 XX% penipuan"
  (from GET /api/analytics — silent fail if unavailable)

[How It Works — 3 steps horizontal]
  📷 Upload  →  🧠 AI Analisis  →  📊 Lihat Hasil
```

---

### 2. Result Page (/result)

```jsx
const { state } = useLocation();
const result = state?.result;
if (!result) return <Navigate to="/" />;

const {
  verdict,
  triggered_rules,
  risk_signals,
  reality_check,
  geo_risk,
  smart_action,
} = result;
```

Single scroll layout. Sticky SectionNav appears after VerdictCard exits viewport.
Nav pills: [Ringkasan] [Aturan] [Sinyal] [Geo] [Gaji] [Bagikan]

---

#### A — VerdictCard id="ringkasan"

```
Card color by verdict.risk_level:
  low:      bg-risk-low/10 border-risk-low/30 text-risk-low
  medium:   bg-risk-medium/10 border-risk-medium/30 text-risk-medium
  high:     bg-risk-high/10 border-risk-high/30 text-risk-high
  critical: bg-risk-critical-bg border-risk-critical text-white
            + CSS criticalPulse animation

Layout:
  [Risk icon]  [getRiskLabel badge]
  smart_action.summary_text  (font-sans text-lg)

  Stats row (only show if not null):
  ┌─────────────────┐  ┌─────────────────┐
  │  Probabilitas   │  │  Skor Aturan    │
  │  formatPct(prob)│  │  score / 100    │
  │  font-mono      │  │  font-mono      │
  └─────────────────┘  └─────────────────┘
  (hide individual stat box if its value is null)
```

---

#### B — Triggered Rules id="aturan"

```
triggered_rules.length > 0:
  Red chips — font-mono text-xs
  bg-risk-high/10 text-risk-high border-risk-high/30

triggered_rules.length === 0:
  Single green chip: "✓ Tidak ada aturan yang terpicu"
```

---

#### C — Risk Signals id="sinyal"

```
2-column grid. Each row: [icon] [label] [status badge]

Signal → Indonesian label → danger direction:
  asks_upfront_payment     → "Minta Bayaran di Muka"          danger if true
  mentions_tourist_visa    → "Pakai Visa Turis"               danger if true
  mentions_pilgrimage_visa → "Pakai Visa Umroh/Haji"          danger if true
  asks_for_passport        → "Minta Paspor Langsung"          danger if true
  promises_fast_process    → "Proses Dijanjikan Cepat"        danger if true
  promises_high_salary     → "Gaji Dijanjikan Sangat Tinggi"  warning if true
  uses_personal_contact    → "Kontak Personal (WA/HP)"        warning if true
  salary_claim_unrealistic → "Klaim Gaji Tidak Masuk Akal"   danger if true
  company_identity_clear   → "Identitas Perusahaan Jelas"     GOOD if true

Status badge:
  danger true:  bg-risk-high/15 text-risk-high     "Ya"
  danger false: bg-white/5 text-white/30            "Tidak"
  good true:    bg-risk-low/15 text-risk-low        "Ya"
  good false:   bg-white/5 text-white/30            "Tidak"

Urgency bar below grid:
  "Tingkat Urgensi" label
  3 pills [Rendah] [Sedang] [Tinggi] — active one highlighted

Risk keywords (if risk_keywords.length > 0):
  Small amber chips, font-mono text-xs
```

---

#### D — Geo Risk id="geo"

```
Card bg-brand-surface:
  country name — font-display text-3xl italic (or "Tidak terdeteksi")
  geo risk_level badge (same color map, note: geo uses UPPERCASE)

Metrics (hide row if value null):
  Tingkat Penipuan: fraud_rate%
  Indeks Kejahatan: crime_index

KBRI block (bg-brand-deep, teal border) — only if nearest_kbri not null:
  🏛️ "KBRI Terdekat"
  nearest_kbri  (font-sans font-semibold)
  kbri_distance_note  (text-sm text-white/60)

If country === null:
  "🌍 Negara tujuan tidak terdeteksi" — muted card
```

---

#### E — Reality Check id="gaji"

```
If offered_salary_idr !== null:
  Offered:  formatIDR(offered_salary_idr) — font-mono text-2xl
  Standard: formatIDR(standard_min_idr) — formatIDR(standard_max_idr)

  Visual bar:
    Offered bar vs standard range
    Green if salary_is_realistic === true
    Red   if salary_is_realistic === false

  Verdict chip (if salary_is_realistic !== null):
    true:  "✅ Gaji Wajar"    bg-risk-low/10 text-risk-low
    false: "🚨 Gaji Tidak Wajar"  bg-risk-high/10 text-risk-high

  Flag callout (amber, if flag !== null):
    flag string in text-sm

If offered_salary_idr === null:
  "💰 Data gaji tidak tersedia" — muted card
```

---

#### F — Share id="bagikan"

```jsx
const handleShare = async () => {
  const payload = {
    title: "Hasil Cek Emigria",
    text: smart_action.share_text,
    url: window.location.href,
  };
  if (navigator.share) {
    try {
      await navigator.share(payload);
      return;
    } catch (e) {
      if (e.name === "AbortError") return;
    }
  }
  await navigator.clipboard.writeText(
    `${smart_action.share_text}\n\n${window.location.href}`,
  );
  toast.success("Teks berhasil disalin!");
};

const waUrl = `https://wa.me/?text=${encodeURIComponent(
  `${smart_action.share_text}\n\n${window.location.href}`,
)}`;
// Primary: share button  |  Secondary: WhatsApp link
```

---

## COMMON COMPONENTS

### Navbar

```
sticky top-0 z-50 backdrop-blur-md
bg-brand-deep/90 border-b border-white/10

Left:  "Emigria" font-display italic text-brand-cta
Right (on Result page only): "← Scan Lagi" → navigate('/')
```

### LoadingOverlay (shown during useScan loading)

```
Full-screen fixed, bg-brand-deep/95 z-50
Center: "Emigria" pulsing wordmark
Cycling text every 1.8s in font-mono text-sm text-brand-cta:
  "🔍 Memindai dokumen..."
  "🧠 AI menganalisis konten..."
  "⚠️  Memeriksa sinyal penipuan..."
  "🌍 Memverifikasi risiko negara..."
  "💰 Mengecek kewajaran gaji..."
  "📋 Menyiapkan laporan..."
```

---

## ANIMATIONS

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.hero-headline {
  animation: fadeInUp 0.6s ease both;
}
.hero-sub {
  animation: fadeInUp 0.6s 0.15s ease both;
}
.scan-card {
  animation: fadeInUp 0.6s 0.3s ease both;
}

@keyframes critPulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
  }
  50% {
    box-shadow: 0 0 0 14px rgba(220, 38, 38, 0);
  }
}
.critical-pulse {
  animation: critPulse 2s ease-in-out infinite;
}

.scan-btn {
  transition: all 0.2s ease;
}
.scan-btn:hover:not(:disabled) {
  background: #00ed64;
  color: #001e2b;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0, 237, 100, 0.2);
}
```

Scroll reveal on result sections (no library — raw IntersectionObserver):

```js
function useReveal(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setV(true);
      },
      { threshold: 0.12 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return v;
}
// className={`transition-all duration-500 ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
```

---

## SETUP FILES

### vite.config.js

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: {
    proxy: { "/api": { target: "http://localhost:3000", changeOrigin: true } },
  },
});
```

### src/main.jsx

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import Home from "./pages/Home";
import Result from "./pages/Result";
import Analytics from "./pages/Analytics";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#003D4F",
            color: "#fff",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: "14px",
            borderRadius: "12px",
            border: "1px solid rgba(0,237,100,0.15)",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
```

### src/index.css

```css
@import "tailwindcss";
*,
*::before,
*::after {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
}
body {
  background-color: #001e2b;
  color: #ffffff;
  font-family: "Plus Jakarta Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  min-height: 100dvh;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: #001e2b;
}
::-webkit-scrollbar-thumb {
  background: #003d4f;
  border-radius: 3px;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
```

---

## EDGE CASES — HANDLE ALL

| Condition                       | Behavior                                   |
| ------------------------------- | ------------------------------------------ |
| `ml_fraud_probability === null` | Hide probability stat block                |
| `pmi_rule_score === null`       | Hide score stat block                      |
| `triggered_rules` is `[]`       | Show "✓ Tidak ada aturan yang terpicu"     |
| `risk_keywords` is `[]`         | Hide keywords section entirely             |
| `offered_salary_idr === null`   | Show "Data gaji tidak tersedia" muted card |
| `salary_is_realistic === null`  | Hide verdict chip                          |
| `flag === null`                 | Hide flag callout box                      |
| `geo_risk.country === null`     | Show "Negara tidak terdeteksi" muted state |
| `nearest_kbri === null`         | Hide KBRI block                            |
| `fraud_rate === null`           | Hide fraud rate row                        |
| `crime_index === null`          | Hide crime index row                       |
| No router state on /result      | `<Navigate to="/" />` immediately          |
| Network timeout                 | toast.error + re-enable submit button      |
| navigator.share unavailable     | Fallback to clipboard copy                 |

---

## IMPLEMENTATION ORDER

```
1.  vite.config.js + tailwind.config.js + index.css + main.jsx
2.  lib/riskUtils.js
3.  lib/api.js
4.  hooks/useScan.js
5.  components/common/Navbar.jsx
6.  components/common/LoadingOverlay.jsx
7.  components/scan/* (ImageDropzone, ScanInput, ScanButton)
8.  pages/Home.jsx
9.  components/result/* (all 7 components)
10. pages/Result.jsx
11. hooks/useAnalytics.js + common/StatsBanner.jsx
12. pages/Analytics.jsx (last — lowest priority)
```

---

## CONSTRAINTS — NEVER VIOLATE

- No login, register, or auth anywhere
- No localStorage — result via router state only
- All UI text in Bahasa Indonesia
- Numbers: Intl.NumberFormat with locale 'id-ID'
- shadcn/ui: Dialog + Tooltip only — everything else custom
- Mobile-first: design at 390px viewport, scale up for desktop
