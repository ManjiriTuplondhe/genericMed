# genericMed — Multi-Tenant Generic Medicine Comparison & Purchase Platform

genericMed is a multi-tenant SaaS platform for FDA generic medicine comparison, real-time dispensing verification, multi-drug interaction checking via Gemini AI, escrow checkout, and pharmacy partner fulfillment.

---

## Architecture & Project Structure

The project is cleanly decoupled into standalone `frontend` and `backend` services:

```text
genericMed/
├── frontend/                      # Client-side React 19 SPA (Vite + Tailwind CSS v4)
│   ├── public/                    # Static assets, PWA manifest, service worker
│   ├── src/
│   │   ├── components/            # 19 UI modules (Customer, Partner, Admin, Modals)
│   │   ├── data/                  # Client-side seed & fallback data
│   │   ├── services/              # API client (fetches to /api via Vite proxy)
│   │   ├── App.tsx                # Main view router & state
│   │   ├── index.css              # Tailwind CSS styles
│   │   ├── main.tsx               # React DOM entry point
│   │   └── types.ts               # Frontend TypeScript definitions
│   ├── index.html                 # HTML shell
│   ├── package.json               # Frontend dependencies
│   ├── tsconfig.json              # Frontend TypeScript config
│   ├── vite.config.ts             # Vite bundler & API reverse proxy configuration
│   ├── .env                       # Frontend environment variables
│   └── .env.example
│
├── backend/                       # REST API Server (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── data/                  # Initial seed mock data for in-memory DataStore
│   │   ├── middleware/            # JWT auth, tenant scoping, rate limiter, error handler
│   │   ├── routes/                # 16 Express REST API route handlers
│   │   ├── services/              # Gemini AI SDK service (@google/genai) & webhooks
│   │   ├── utils/                 # Structured logger & input validation
│   │   ├── db.ts                  # In-memory thread-safe DataStore & repositories
│   │   ├── index.ts               # Express server entry point (Port 5000)
│   │   └── types.ts               # Backend domain types & interfaces
│   ├── tests/                     # Automated backend verification test suites
│   ├── package.json               # Backend dependencies
│   ├── tsconfig.json              # Backend TypeScript config
│   ├── .env                       # Backend environment variables
│   └── .env.example
│
├── package.json                   # Root workspace orchestration scripts
├── README.md                      # Project documentation
├── .gitignore                     # Git ignore rules
└── [docs]                         # changelog.md, decisions.md, memory.md, phases.md, rules.md
```

---

## Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

---

### 1. Install Dependencies

You can install all dependencies from the root:
```bash
npm run install:all
```

Or install dependencies independently for each package:

#### Frontend:
```bash
cd frontend
npm install
```

#### Backend:
```bash
cd backend
npm install
```

---

### 2. Environment Variables Configuration

#### Frontend (`frontend/.env`):
```env
VITE_API_URL="/api"
VITE_APP_NAME="genericMed"
VITE_BACKEND_URL="http://localhost:5000"
```

#### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=genericmed-secure-jwt-secret-key-2026

# Optional: Set your Gemini API key for clinical AI interactions & natural language search
GEMINI_API_KEY="your-gemini-api-key-here"

APP_URL="http://localhost:5000"
```

---

### 3. Running the Application

#### Option A: Run Both Together from Root (Recommended)
From the project root:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend SPA**: `http://localhost:3000` (proxies `/api` requests to backend)

---

#### Option B: Run Services Individually

**Start the Backend Server**:
```bash
cd backend
npm run dev
# Server listening at http://localhost:5000
```

**Start the Frontend Client**:
```bash
cd frontend
npm run dev
# Vite dev server running at http://localhost:3000
```

---

## Verification & Testing

Run all backend verification test suites:
```bash
# From root:
npm test

# Or from backend/:
cd backend
npm run test:all
```

Individual test suites:
- `npm --prefix backend run test:phase2` — Verifies Escrow hold, SEC-18 ledger, NPI registry check.
- `npm --prefix backend run test:phase3` — Verifies 7d/30d analytics and self-serve onboarding.
- `npm --prefix backend run test:phase4` — Verifies marketplace adapters, multi-region failover, fraud detection, and AI safety checks.
- `npm --prefix backend run test:api` — Live REST endpoint integration tests.

Type checking and linting:
```bash
# Check both frontend and backend
npm run lint
```

Production Build:
```bash
npm run build
```

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status & uptime |
| `GET` | `/api/medicines` | Search & filter FDA generic drug catalog |
| `GET` | `/api/medicines/:id` | Drug details & pharmacy price comparison offers |
| `POST` | `/api/cart/validate` | Real-time stock validation & price check |
| `POST` | `/api/orders` | Place multi-tenant prescription order |
| `POST` | `/api/auth/login` | JWT Authentication & role assignment |
| `POST` | `/api/ai/interactions` | Gemini AI multi-drug interaction analysis |
| `GET` | `/api/admin/analytics` | SEC-18 compliance GMV & savings analytics |
| `GET` | `/api/marketplace/adapters` | External pharmacy marketplace integrations |
| `GET` | `/api/regions/status` | Multi-region latency & failover health |
| `GET` | `/api/fraud/alerts` | Real-time prescription fraud anomaly alerts |
