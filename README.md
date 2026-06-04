# EMIGRIA - Platform Deteksi Penipuan Lowongan Kerja Luar Negeri

> **Multimodal AI-Powered Overseas Job Fraud Detection**
> Platform berbasis AI multimodal untuk membantu Pekerja Migran Indonesia (PMI) mendeteksi lowongan kerja luar negeri yang berpotensi penipuan.

---

## Tentang EMIGRIA

EMIGRIA adalah aplikasi web yang memungkinkan siapa saja — terutama calon Pekerja Migran Indonesia (PMI) — untuk **menganalisis brosur atau informasi lowongan kerja luar negeri** yang mencurigakan. Pengguna cukup mengunggah foto brosur, menempel teks, atau memasukkan URL, lalu sistem akan mengevaluasi tingkat risiko penipuan menggunakan gabungan kecerdasan buatan (AI) dan machine learning.

### Cara Kerja

```
Input (Gambar / Teks / URL)
        ↓
Express.js Orchestrator (Back-End)
        ↓
Google Gemini 3.1 Flash lite  →  Ekstraksi data terstruktur dari brosur
        ↓
FastAPI ML Service        →  MLP untuk menghitung fraud probability (0.0–1.0)
        ↓
Geographic Risk Analyzer  →  Skor risiko berdasarkan negara tujuan
        ↓
Reality Check (BP2MI)     →  Verifikasi kewajaran gaji & janji kerja
        ↓
Response JSON             →  Verdict + Detail + Smart Action
        ↓
React Frontend            →  Tampilan hasil analisis kepada pengguna
```

> **Zero-Friction Design:** Tidak perlu login, tidak perlu registrasi, tidak ada data pribadi yang disimpan.

---

## Arsitektur Monorepo

Proyek EMIGRIA terdiri dari **dua repository terpisah**:

```
# Repo 1: emigria-web (repo ini)
emigrIa-web/
├── front-end/          # React + TypeScript + Vite (UI)
└── back-end/           # Express.js + Prisma + Node.js (API Orchestrator)

# Repo 2: emigria-ai-model (repo terpisah)
emigrIa-ai-model/
└── api/                # FastAPI + TensorFlow MLP (ML Inference Service)
```

---

## Sub-Proyek

### [front-end](./front-end/README.md)

Antarmuka pengguna berbasis **React 19 + TypeScript + Vite**.

| Teknologi    | Versi |
| ------------ | ----- |
| React        | 19    |
| TypeScript   | ~6.0  |
| Vite         | 8     |
| Tailwind CSS | 4     |
| MapLibre GL  | 5     |
| Recharts     | 3     |

### [back-end](./back-end/README.md)

API orchestrator berbasis **Node.js + Express 5**.

| Teknologi         | Versi |
| ----------------- | ----- |
| Node.js           | 20+   |
| Express           | 5     |
| Prisma ORM        | 7     |
| PostgreSQL (Neon) | 17    |
| Google Gemini SDK | 0.24  |
| Zod               | 4     |

---

## Quick Start

### Prasyarat

- **Node.js** 20+
- **Python** 3.10+
- **Docker** (untuk AI-MODEL)
- Akun [Neon](https://neon.tech/) (PostgreSQL serverless)
- [Google AI Studio API Key](https://aistudio.google.com/)

### 1. Clone Repository

```bash
# Clone repo utama (front-end + back-end)
git clone https://github.com/<your-org>/emigria-web.git
cd emigria-web

# Clone repo AI-MODEL (terpisah)
git clone https://github.com/<your-org>/emigria-ai-model.git
cd emigria-ai-model
```

### 2. Jalankan AI-MODEL (FastAPI)

```bash
cd emigria-ai-model
docker-compose up --build -d
# Service berjalan di http://localhost:8000
```

### 3. Jalankan Back-End (Express.js)

```bash
cd emigria-web/back-end
npm install
cp .env.example .env   # Isi nilai .env
npx prisma generate
npm run dev
# Server berjalan di http://localhost:3000
```

### 4. Jalankan Front-End (React + Vite)

```bash
cd emigria-web/front-end
npm install
npm run dev
# Aplikasi berjalan di http://localhost:5173
```

---

## API Endpoints (Back-End)

| Method | Endpoint         | Deskripsi                        |
| ------ | ---------------- | -------------------------------- |
| `GET`  | `/health`        | Health check server              |
| `POST` | `/api/scan`      | Submit lowongan untuk dianalisis |
| `GET`  | `/api/analytics` | Statistik tren penipuan anonim   |

### Contoh Request (`POST /api/scan`)

```bash
# Kirim gambar brosur
curl -X POST http://localhost:3000/api/scan \
  -F "input_type=image" \
  -F "file=@brosur_lowongan.jpg"

# Kirim teks
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"input_type": "text", "text": "Gaji besar! Visa turis. Kirim paspor sekarang..."}'
```

## Risk Level

Sistem EMIGRIA menggunakan dua level risiko yang ditampilkan ke pengguna:

| Risk Level (dari AI-MODEL) | Ditampilkan ke Pengguna | Keterangan                        |
| -------------------------- | ----------------------- | --------------------------------- |
| `LOW_RISK`                 | 🟢 **Risiko Rendah**    | Aman / tidak terindikasi penipuan |
| `HIGH_RISK`                | 🔴 **Risiko Tinggi**    | Berisiko / terindikasi penipuan   |

> **Catatan:** AI-MODEL juga menghasilkan status `REVIEW` (skor antara 0.40–0.60) namun diperlakukan sebagai `HIGH_RISK` di sisi back-end dan front-end untuk memberikan peringatan lebih konservatif demi keselamatan PMI.

---

## Dokumentasi API AI-MODEL

Back-end EMIGRIA mengirim request ke AI-MODEL (FastAPI) dan menerima response untuk diproses lebih lanjut sebelum dikirim ke front-end.

### Endpoints AI-MODEL

| Method | Endpoint         | Deskripsi                        |
| ------ | ---------------- | -------------------------------- |
| `GET`  | `/health`        | Status model & artifact          |
| `POST` | `/predict`       | Prediksi fraud satu lowongan     |
| `POST` | `/predict-batch` | Prediksi batch beberapa lowongan |

---

### Request ke AI-MODEL (`POST /predict`)

Back-end mengirim data terstruktur hasil ekstraksi Gemini dalam format JSON:

```json
{
  "title": "Cleaning Service",
  "location": "Malaysia, Kuala Lumpur",
  "country": "Malaysia",
  "salary_range": "1500-2000",
  "description": "Gaji besar, proses cepat, langsung berangkat...",
  "requirements": "",
  "company_profile": "",
  "employment_type": "Full-time",
  "industry": "Domestic Work",
  "benefits": "Tempat tinggal disediakan",
  "required_experience": "Not Specified",
  "required_education": "Not Specified",
  "telecommuting": 0,
  "has_company_logo": 0,
  "has_questions": 0
}
```

> Jika Gemini tidak menemukan suatu field, default yang digunakan: string → `""`, kategori → `"Unknown"` / `"Not Specified"`, binary → `0`.

---

### Response dari AI-MODEL

AI-MODEL mengembalikan JSON berikut ke back-end:

```json
{
  "ml_fraud_probability": 0.73,
  "ml_fraud_percentage": 73.0,
  "ml_fraud_prediction": 1,

  "pmi_rule_score": 9,
  "pmi_normalized_score": 0.9,
  "pmi_risk_percentage": 90.0,
  "pmi_rule_prediction": 1,

  "triggered_rules": [
    "langsung berangkat",
    "gaji besar",
    "no_company_logo",
    "no_screening_questions",
    "company_profile_empty"
  ],

  "hard_stop_triggered": false,
  "hard_stop_count": 0,

  "ml_weight": 0.3,
  "pmi_weight": 0.7,

  "final_risk_score": 0.849,
  "final_risk_percentage": 84.9,
  "fraud_prediction": 1,
  "risk_level": "HIGH_RISK",

  "threshold": 0.5,
  "pmi_rule_threshold": 6,
  "review_threshold": 0.4,
  "high_risk_threshold": 0.6
}
```

| Field                   | Tipe       | Keterangan                                   |
| ----------------------- | ---------- | -------------------------------------------- |
| `ml_fraud_probability`  | `float`    | Probabilitas fraud dari MLP (0.0–1.0)        |
| `ml_fraud_percentage`   | `float`    | Versi persentase dari ml_fraud_probability   |
| `ml_fraud_prediction`   | `int`      | 1 jika MLP menganggap fraud, 0 jika tidak    |
| `pmi_rule_score`        | `int`      | Skor rule-based dari keyword PMI (0–10+)     |
| `pmi_normalized_score`  | `float`    | Skor PMI ternormalisasi (0.0–1.0)            |
| `pmi_risk_percentage`   | `float`    | Versi persentase dari pmi_normalized_score   |
| `pmi_rule_prediction`   | `int`      | 1 jika skor PMI ≥ threshold                  |
| `triggered_rules`       | `string[]` | Daftar keyword/rule yang terdeteksi          |
| `hard_stop_triggered`   | `bool`     | True jika ≥2 hard-stop keyword ditemukan     |
| `hard_stop_count`       | `int`      | Jumlah hard-stop keyword yang terdeteksi     |
| `final_risk_score`      | `float`    | Skor gabungan hybrid (0.0–1.0)               |
| `final_risk_percentage` | `float`    | Versi persentase dari final_risk_score       |
| `fraud_prediction`      | `int`      | 1 jika HIGH_RISK/REVIEW, 0 jika LOW_RISK     |
| `risk_level`            | `string`   | `"LOW_RISK"`, `"REVIEW"`, atau `"HIGH_RISK"` |
| `threshold`             | `float`    | Threshold MLP yang digunakan                 |

---

### Key JSON yang Ditampilkan di Front-End

Back-end meneruskan response ke front-end dalam struktur yang sedikit berbeda. Berikut key yang aktif digunakan di UI:

#### `verdict` — Ditampilkan di VerdictCard

| Key                             | Sumber                           | Digunakan Untuk                                           |
| ------------------------------- | -------------------------------- | --------------------------------------------------------- |
| `verdict.risk_level`            | AI-MODEL `risk_level`            | Label risiko (Risiko Rendah / Risiko Tinggi) + warna card |
| `verdict.final_risk_percentage` | AI-MODEL `final_risk_percentage` | Skor risiko utama (%) dengan progress bar                 |
| `verdict.ml_fraud_probability`  | AI-MODEL `ml_fraud_probability`  | Fallback jika final_risk_percentage tidak ada             |
| `verdict.hard_stop_triggered`   | AI-MODEL `hard_stop_triggered`   | Badge "Hard Stop" merah jika True                         |
| `triggered_rules`               | AI-MODEL `triggered_rules`       | Daftar faktor risiko (diterjemahkan ke Bahasa Indonesia)  |

#### `smart_action` — Ditampilkan di VerdictCard & ShareButton

| Key                         | Digunakan Untuk                                   |
| --------------------------- | ------------------------------------------------- |
| `smart_action.summary_text` | Ringkasan analisis (kalimat utama di VerdictCard) |
| `smart_action.share_text`   | Teks yang dibagikan via tombol Share              |

#### `reality_check` — Ditampilkan di RealityCheck

| Key                                    | Digunakan Untuk                               |
| -------------------------------------- | --------------------------------------------- |
| `reality_check.red_flags`              | Daftar red flag kewajaran (gaji, janji kerja) |
| `reality_check.suspicious_promises`    | Janji-janji mencurigakan yang terdeteksi      |
| `reality_check.salary_is_realistic`    | Boolean kewajaran gaji                        |
| `reality_check.realistic_salary_range` | Rentang gaji wajar versi BP2MI                |
| `reality_check.assessment_summary`     | Ringkasan penilaian kewajaran                 |

#### `geo_risk` — Ditampilkan di GeoRiskCard

| Key                                | Digunakan Untuk                             |
| ---------------------------------- | ------------------------------------------- |
| `geo_risk[].country`               | Nama negara tujuan                          |
| `geo_risk[].iso3`                  | Kode ISO negara (untuk peta MapLibre)       |
| `geo_risk[].risk_level`            | Level risiko negara (`low`/`medium`/`high`) |
| `geo_risk[].crime_index`           | Indeks kriminalitas (skala 0–10)            |
| `geo_risk[].crime_level`           | Label tingkat kriminalitas                  |
| `geo_risk[].crime_variation`       | Perubahan crime index vs tahun sebelumnya   |
| `geo_risk[].crime_rankings.region` | Peringkat kriminalitas regional             |
| `geo_risk[].crime_rankings.global` | Peringkat kriminalitas global               |
| `geo_risk[].crime_historical`      | Riwayat crime index per tahun (grafik tren) |
| `geo_risk[].source_note`           | Catatan sumber data (disclaimer)            |

---

## Deployment

Proyek ini di-deploy menggunakan konfigurasi `render.yaml`:

| Service   | Platform               | URL                                    |
| --------- | ---------------------- | -------------------------------------- |
| Front-End | Vercel                 | `https://emigria.vercel.app`           |
| Back-End  | Render.com (Singapore) | `https://emigria-backend.onrender.com` |
| AI-MODEL  | Render.com             | `https://ai-model-rha2.onrender.com`   |

---

## Team

**Coding Camp 2026 — powered by DBS Foundation**

| Peran                 | Tanggung Jawab                         |
| --------------------- | -------------------------------------- |
| Full-Stack / Backend  | Express.js API Orchestrator            |
| AI Engineer           | FastAPI + MLP                          |
| Data Science          | Dataset, Cleaning, Feature Engineering |
| Full-Stack / Frontend | React UI & Visualisasi                 |

---
