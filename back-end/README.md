# EMIGRIA Backend

**Multimodal AI-Powered Overseas Job Fraud Detection**
*Platform Deteksi Penipuan Lowongan Kerja Luar Negeri Berbasis AI Multimodal*

---

## 📋 Description

EMIGRIA helps Indonesian Migrant Workers (PMI / Pekerja Migran Indonesia) detect fraudulent overseas job offers. Users can submit suspicious job offers via **image**, **text**, or **URL**, and the platform analyzes them using AI and machine learning to determine the likelihood of fraud.

### How It Works

1. User submits a suspicious overseas job offer (image / text / URL)
2. Backend sends it to **Gemini 1.5 Flash** for structured data extraction
3. Extracted JSON is forwarded to a **FastAPI ML service** running an MLP deep learning model → returns a fraud probability score (0.0 – 1.0)
4. Backend runs a **Geographic Risk Analyzer** and **Reality Check** against official BP2MI government standards
5. All results are merged into a single clean JSON response
6. Anonymous scan logs are saved to **Neon (PostgreSQL)** for analytics

> **Zero-Friction Design:** No user login, no registration, no personal data stored.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express 5 |
| Language | JavaScript (ESM) |
| Database | PostgreSQL (Neon Serverless) |
| ORM | Prisma 7 |
| AI Extraction | Google Gemini 2.5 Flash SDK |
| ML Scoring | FastAPI + MLP Model (external service) |
| Validation | Zod |
| File Upload | Multer |
| HTTP Client | Axios |
| Security | Helmet, CORS |

---

## 📦 Prerequisites

- **Node.js** 20+ ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **PostgreSQL** database (we use [Neon](https://neon.tech/))

---

## 🚀 Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/emigria-backend.git
cd emigria-backend

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env
# → Fill in your .env values

# 4. Generate Prisma Client
npx prisma generate

# 5. Start development server
npm run dev
```

The server will start at `http://localhost:3000` (or your configured PORT).

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check — returns server status |
| `POST` | `/api/scan` | Submit a job offer for fraud analysis |
| `GET` | `/api/analytics` | Get aggregated anonymous scan trends |

---

## ⏳ Waiting For

The following deliverables from other team members are required before full implementation:

| Item | Owner | Status |
|------|-------|--------|
| FastAPI ML endpoint + request/response schema | AI Engineer Team | 🔲 Pending |
| BP2MI salary standard data | Data Science Team | 🔲 Pending |
| Country risk data (KBRI + crime index) | Data Science Team | 🔲 Pending |
| Final database schema agreement | Full Team | 🔲 Pending |

---

## 📜 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start | `npm start` | Run production server |
| Dev | `npm run dev` | Run with nodemon (auto-restart) |
| Lint | `npm run lint` | Run ESLint on src/ |

---

## 👥 Team

**Coding Camp 2026 — powered by DBS Foundation**

---

## 📄 License

ISC
