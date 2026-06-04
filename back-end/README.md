# EMIGRIA Backend

## 🛠 Tech Stack

| Layer         | Technology                             |
| ------------- | -------------------------------------- |
| Runtime       | Node.js 20+                            |
| Framework     | Express 5                              |
| Language      | JavaScript (ESM)                       |
| Database      | PostgreSQL (Neon Serverless)           |
| ORM           | Prisma 7                               |
| AI Extraction | Google Gemini 2.5 Flash SDK            |
| ML Scoring    | FastAPI + MLP Model (external service) |
| Validation    | Zod                                    |
| File Upload   | Multer                                 |
| HTTP Client   | Axios                                  |
| Security      | Helmet, CORS                           |

---

## 📦 Prerequisites

- **Node.js** 20+ ([download](https://nodejs.org/))
- **npm** (sudah termasuk dalam Node.js)
- Akun [Neon](https://neon.tech/) untuk database PostgreSQL serverless
- [Google AI Studio API Key](https://aistudio.google.com/app/apikey) untuk Gemini
- AI-MODEL (FastAPI) berjalan di `http://localhost:8000` (lihat [emigria-ai-model](https://github.com/<your-org>/emigria-ai-model))

---

## 🚀 Setup untuk Tim (Clone & Run)

### 1. Clone Repository

```bash
git clone https://github.com/<your-org>/emigria-web.git
cd emigria-web/back-end
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Buat File `.env`

```bash
cp .env.example .env
```

Kemudian buka `.env` dan isi nilai berikut:

```env
PORT=3000
NODE_ENV=development

# Dapatkan dari: https://console.neon.tech → Connection string
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Dapatkan dari: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here

# URL FastAPI ML service (jalankan emigria-ai-model terlebih dahulu)
ML_SERVICE_URL=http://localhost:8000

# Origins yang diizinkan mengakses API (pisahkan dengan koma)
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Server berjalan di `http://localhost:3000`.

> **Catatan:** Pastikan AI-MODEL (FastAPI) juga sudah berjalan di `http://localhost:8000` sebelum mencoba endpoint `/api/scan`. Back-end akan tetap bisa start tanpa AI-MODEL, tapi scan akan gagal.

---

## 📁 Folder Structure

```
emigria-backend/
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── nodemon.json
├── prisma.config.ts              # Prisma 7 config (datasource URL)
│
├── prisma/
│   └── schema.prisma           # Database schema (Prisma 7 ORM)
│
└── src/
    ├── server.js                # HTTP server entry point
    ├── app.js                   # Express app setup & middleware
    │
    ├── config/
    │   ├── env.js               # Environment variable exports
    │   └── constants.js         # BP2MI standards & country risk data
    │
    ├── middlewares/
    │   ├── errorHandler.js      # Global error handler
    │   ├── notFound.js          # 404 route handler
    │   └── validateScan.js      # Zod validation + multer config
    │
    ├── routes/
    │   ├── index.js             # Route aggregator
    │   └── scan.routes.js       # Scan & analytics routes
    │
    ├── controllers/
    │   ├── scan.controller.js   # Fraud scan orchestrator
    │   └── analytics.controller.js  # Analytics data handler
    │
    ├── services/
    │   ├── inputProcessor.js    # Normalize image/text/URL input
    │   ├── geminiService.js     # Gemini API integration
    │   ├── mlService.js         # FastAPI ML service client
    │   ├── geoRiskService.js    # Geographic risk scoring
    │   ├── realityCheckService.js   # BP2MI reality check
    │   ├── responseFormatter.js # Merge pipeline outputs
    │   └── logService.js        # Anonymous scan logging
    │
    └── utils/
        └── axiosClient.js       # Simple pre-configured Axios instance
```

---

## 🔌 API Endpoints

| Method | Endpoint         | Description                           |
| ------ | ---------------- | ------------------------------------- |
| `GET`  | `/health`        | Health check — returns server status  |
| `POST` | `/api/scan`      | Submit a job offer for fraud analysis |
| `GET`  | `/api/analytics` | Get aggregated anonymous scan trends  |

---

## 📜 Scripts

| Script | Command        | Description                     |
| ------ | -------------- | ------------------------------- |
| Start  | `npm start`    | Run production server           |
| Dev    | `npm run dev`  | Run with nodemon (auto-restart) |
| Lint   | `npm run lint` | Run ESLint on src/              |
