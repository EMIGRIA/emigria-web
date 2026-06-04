# EMIGRIA — Front-End

> Antarmuka pengguna untuk platform deteksi penipuan lowongan kerja luar negeri berbasis AI multimodal

---

## 📖 Deskripsi

Front-end EMIGRIA dibangun sebagai aplikasi **Single Page Application (SPA)** dengan React 19 dan TypeScript. Pengguna dapat menginput lowongan kerja mencurigakan lewat teks atau gambar, dan melihat hasil analisis fraud secara visual dan interaktif — termasuk peta risiko geografis, grafik analitik, dan indikator risiko terperinci.

---

## 🗂️ Struktur Proyek

```
front-end/
├── public/                     # Aset statis publik
├── src/
│   ├── components/
│   │   ├── common/             # Komponen reusable global
│   │   │   ├── Navbar.tsx          # Navigasi utama + toggle tema
│   │   │   ├── LoadingOverlay.tsx  # Overlay loading animasi
│   │   │   └── StatsBanner.tsx     # Banner statistik ringkas
│   │   ├── scan/               # Komponen untuk input scan
│   │   │   ├── ScanInput.tsx       # Tab input (teks / gambar) + form
│   │   │   ├── ImageDropzone.tsx   # Area drag-and-drop upload gambar
│   │   │   └── ScanButton.tsx      # Tombol submit scan
│   │   └── result/             # Komponen untuk tampilan hasil
│   │       ├── VerdictCard.tsx         # Kartu verdict utama (skor + level risiko)
│   │       ├── GeoRiskCard.tsx         # Kartu risiko geografis + indikator negara
│   │       ├── CountryMapVisual.tsx    # Visualisasi peta negara tujuan (MapLibre GL)
│   │       ├── RealityCheck.tsx        # Daftar red flags & cek kewajaran
│   │       ├── OfficialDataCard.tsx    # Data resmi BP2MI
│   │       ├── OfficialDataStickyNote.tsx # Catatan data resmi
│   │       ├── SectionNav.tsx          # Navigasi antar-seksi hasil
│   │       └── ShareButton.tsx         # Tombol berbagi hasil scan
│   ├── context/
│   │   └── ThemeContext.tsx     # Global theme (dark/light mode)
│   ├── hooks/
│   │   ├── useScan.ts           # Custom hook: logika submit & state scan
│   │   └── useAnalytics.ts      # Custom hook: fetch data analitik
│   ├── lib/
│   │   └── riskUtils.ts         # Utilitas: label risiko, format IDR, map triggered_rules
│   ├── pages/
│   │   ├── Home.tsx             # Halaman utama (hero + scan input)
│   │   ├── Result.tsx           # Halaman hasil analisis
│   │   └── Analytics.tsx        # Halaman dashboard analitik (Recharts)
│   ├── types/
│   │   └── index.ts             # Definisi TypeScript types global
│   ├── index.css                # Sistem desain global (CSS variables, Tailwind)
│   └── main.tsx                 # Entry point — routing & provider
├── index.html                   # HTML root
├── vite.config.ts               # Konfigurasi Vite + proxy API
├── tsconfig.json                # Konfigurasi TypeScript
├── eslint.config.js             # Konfigurasi ESLint
└── package.json                 # Dependencies & scripts
```

---

## 📚 Library & Teknologi

### Core

| Library                                       | Versi     | Kegunaan                |
| --------------------------------------------- | --------- | ----------------------- |
| [React](https://reactjs.org/)                 | `^19.2.5` | UI framework utama      |
| [React DOM](https://reactjs.org/)             | `^19.2.5` | DOM rendering           |
| [TypeScript](https://www.typescriptlang.org/) | `~6.0.2`  | Static typing           |
| [Vite](https://vitejs.dev/)                   | `^8.0.10` | Build tool & dev server |

### Routing

| Library                                      | Versi     | Kegunaan                  |
| -------------------------------------------- | --------- | ------------------------- |
| [React Router DOM](https://reactrouter.com/) | `^7.15.1` | Client-side routing (SPA) |

### Styling

| Library                                                                   | Versi    | Kegunaan                             |
| ------------------------------------------------------------------------- | -------- | ------------------------------------ |
| [Tailwind CSS](https://tailwindcss.com/)                                  | `^4.3.0` | Utility-first CSS framework          |
| [@tailwindcss/vite](https://tailwindcss.com/docs/installation/using-vite) | `^4.3.0` | Integrasi Tailwind dengan Vite       |
| [tw-animate-css](https://www.npmjs.com/package/tw-animate-css)            | `^1.4.0` | Animasi Tailwind CSS                 |
| [clsx](https://github.com/lukeed/clsx)                                    | `^2.1.1` | Utilitas conditional className       |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge)               | `^3.6.0` | Merge Tailwind classes tanpa konflik |
| [@fontsource-variable/geist](https://fontsource.org/)                     | `^5.2.9` | Font Geist (variable font)           |

### Visualisasi & Data

| Library                              | Versi     | Kegunaan                               |
| ------------------------------------ | --------- | -------------------------------------- |
| [Recharts](https://recharts.org/)    | `^3.8.1`  | Grafik analitik (bar, pie, line chart) |
| [MapLibre GL](https://maplibre.org/) | `^5.24.0` | Peta interaktif negara tujuan kerja    |

### HTTP & Komunikasi

| Library                          | Versi     | Kegunaan                                  |
| -------------------------------- | --------- | ----------------------------------------- |
| [Axios](https://axios-http.com/) | `^1.16.1` | HTTP client untuk request ke back-end API |

### Notifikasi

| Library                                         | Versi    | Kegunaan                           |
| ----------------------------------------------- | -------- | ---------------------------------- |
| [React Hot Toast](https://react-hot-toast.com/) | `^2.6.0` | Toast notification (sukses, error) |

### Icons

| Library                             | Versi     | Kegunaan                  |
| ----------------------------------- | --------- | ------------------------- |
| [Lucide React](https://lucide.dev/) | `^1.16.0` | Icon library berbasis SVG |

### Dev Tools

| Library                                                                              | Versi     | Kegunaan                               |
| ------------------------------------------------------------------------------------ | --------- | -------------------------------------- |
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)                  | `^6.0.1`  | Plugin React untuk Vite (Fast Refresh) |
| [ESLint](https://eslint.org/)                                                        | `^10.2.1` | Linter JavaScript/TypeScript           |
| [typescript-eslint](https://typescript-eslint.io/)                                   | `^8.58.2` | ESLint rules untuk TypeScript          |
| [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) | `^7.1.1`  | Lint rules untuk React Hooks           |

---

## 🖥️ Halaman Aplikasi

### `/` — Home (Scan Input)

Halaman utama tempat pengguna memasukkan lowongan kerja yang ingin dianalisis. Mendukung dua mode input:

- **Mode Teks** — Tempel teks deskripsi lowongan
- **Mode Gambar** — Upload atau drag-and-drop foto brosur (JPG/PNG/WebP)

### `/result` — Hasil Analisis

Menampilkan hasil analisis mendalam:

- **Verdict Card** — Skor risiko (0–100%), level risiko (Risiko Rendah / Risiko Tinggi), dan ringkasan analisis
- **Red Flags** — Daftar indikator penipuan yang terdeteksi (dari PMI rules)
- **Geo Risk** — Peta negara tujuan + skor risiko geografis berbasis data BP2MI/KBRI
- **Reality Check** — Verifikasi kewajaran gaji dan janji kerja vs. standar resmi
- **Official Data** — Referensi data resmi lembaga pemerintah
- **Share Button** — Bagikan hasil scan ke WhatsApp, media sosial, dll.

### `/analytics` — Dashboard Analitik

Dashboard statistik agregat dari seluruh scan anonim:

- Tren penipuan per negara tujuan
- Distribusi level risiko
- Jenis input paling sering digunakan
- Grafik time-series aktivitas scan

---

## 🎨 Sistem Desain

Desain EMIGRIA menggunakan **CSS Custom Properties** (variabel CSS) yang didefinisikan di `index.css`, mendukung **dark mode** dan **light mode** secara otomatis.

### Color Tokens

| Token             | Kegunaan                         |
| ----------------- | -------------------------------- |
| `--brand-primary` | Warna utama brand                |
| `--brand-surface` | Background surface/card          |
| `--risk-low`      | Indikator risiko rendah (hijau)  |
| `--risk-medium`   | Indikator risiko sedang (kuning) |
| `--risk-high`     | Indikator risiko tinggi (merah)  |
| `--text-muted`    | Teks sekunder/dim                |
| `--border-main`   | Garis border utama               |

### Tema

- **Dark Mode** (default): Interface gelap modern
- **Light Mode**: Tersedia via `ThemeContext` + toggle di Navbar
- **Font**: Geist Variable (sistem tipografi yang bersih dan modern)

---

---

## 🚀 Quick Start

### Prasyarat

- **Node.js** 20+
- **npm** (sudah termasuk dalam Node.js)
- Back-end Express.js berjalan di `http://localhost:3000`

### Instalasi

```bash
# Masuk ke direktori front-end
cd front-end

# Install dependencies
npm install
```

### Development

```bash
npm run dev
# → Aplikasi berjalan di http://localhost:5173
```

### Build Production

```bash
npm run build
# → Output tersimpan di dist/
```

### Preview Build

```bash
npm run preview
# → Preview production build di http://localhost:4173
```

### Lint

```bash
npm run lint
```

---

## 📜 Scripts

| Script  | Perintah          | Deskripsi                                         |
| ------- | ----------------- | ------------------------------------------------- |
| Dev     | `npm run dev`     | Jalankan dev server dengan Hot Module Replacement |
| Build   | `npm run build`   | Compile TypeScript + bundle untuk production      |
| Preview | `npm run preview` | Preview hasil build production                    |
| Lint    | `npm run lint`    | Jalankan ESLint pada seluruh file                 |

---

## 🔗 Koneksi ke Back-End

Front-end berkomunikasi dengan back-end EMIGRIA melalui HTTP REST API:

| Endpoint         | Method | Deskripsi                                             |
| ---------------- | ------ | ----------------------------------------------------- |
| `/api/scan`      | `POST` | Kirim lowongan untuk dianalisis (form-data atau JSON) |
| `/api/analytics` | `GET`  | Ambil data statistik scan anonim                      |

Response dari API langsung di-render ke komponen-komponen di halaman `/result`.

---
