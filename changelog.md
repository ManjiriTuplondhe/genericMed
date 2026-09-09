# 📜 Changelog — genericMed

> **Format:** Based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).
>
> **Purpose:** Chronological history of all project changes. Every PR or significant commit should add an entry here.

---

## Version Legend

| Type        | Description                                           |
|-------------|-------------------------------------------------------|
| **Added**   | New features, components, files, or capabilities      |
| **Changed** | Modifications to existing functionality or behavior   |
| **Fixed**   | Bug fixes                                              |
| **Removed** | Deleted features, files, or deprecated code           |
| **Security**| Security-related changes or vulnerability fixes       |

---

## [Unreleased]

_Changes staged for the next version release._

---

## [0.5.0] — 2026-09-09

> **Milestone:** Phase 4 — Enterprise & Marketplace
>
> Implementation of the Pharmacy Management System (PMS) Integration Marketplace with bidirectional sync, Multi-Drug CYP450 Clinical Interaction Matrix, 24/7 Patient Clinical Support Chatbot (Gemini AI), Multi-Region Database Replication & Failover Simulator, and Real-Time Fraud & DEA Velocity Anomaly Engine.

### Added

#### Backend Routes & Database Methods (`server/`)
- `server/routes/marketplace.ts` — `GET /api/marketplace/adapters` (lists QS/1, PioneerRx, Liberty Software, Rx30, Epic Willow connectors), `POST /api/marketplace/adapters/:id/sync` (on-demand stock & dispensing sync), `POST /api/marketplace/adapters/:id/configure` (saves connection URLs & mTLS/OAuth2 auth).
- `server/routes/regions.ts` — `GET /api/regions/status` (multi-region cluster topology across 4 regions) and `POST /api/regions/simulate-failover` (zero-downtime disaster recovery failover with SEC-18 audit log recording).
- `server/routes/fraud.ts` — `GET /api/fraud/alerts` (active velocity alerts) and `POST /api/fraud/evaluate` (real-time risk scoring, DEA Schedule II–V velocity, and NPI surge surveillance).
- `server/routes/ai.ts` — `POST /api/ai/multi-drug-check` (multi-drug pairwise CYP450 enzyme conflict detection) and `POST /api/ai/patient-chat` (24/7 clinical AI assistant conversation).
- `server/test-phase4.ts` — Automated end-to-end verification suite testing PMS sync, multi-drug matrix, AI chat, multi-region failover, and fraud detection (7/7 tests passing).

#### Frontend Components & Features
- `src/components/PharmacyMarketplaceModal.tsx` — Pharmacy PMS marketplace modal allowing partners and admins to browse, configure, and trigger real-time stock sync across 5 PMS platforms.
- `src/components/MultiDrugInteractionModal.tsx` — Interactive multi-drug selector and clinical matrix checker displaying overall risk ratings, pairwise findings, CYP enzyme pathways, and CPIC clinical recommendations.
- `src/components/PatientClinicalAssistantModal.tsx` — 24/7 AI-powered floating drawer with conversational prescription help, action shortcuts (View Drug, Check Interactions, Call Pharmacist), and FDA bioequivalence explanations.
- `src/components/MultiRegionStatusModal.tsx` — Multi-region cluster health dashboard displaying replication lag gauges (sub-15ms North America), global throughput, and one-click disaster recovery failover simulation.

### Changed
- `src/types.ts` — Added `PharmacyMarketplaceAdapter`, `MultiDrugInteractionCheck`, `MultiRegionNode`, `FraudDetectionAlert`, `AiChatMessage` interfaces.
- `src/services/api.ts` — Added all 9 Phase 4 client methods with resilient offline fallback data.
- `src/components/NavigationHeader.tsx` & `src/App.tsx` — Integrated quick trigger buttons ("AI Assistant", "Drug Matrix", "PMS Marketplace", "Regions") and mounted all Phase 4 modal workflows.

---

## [0.4.0] — 2026-09-09

> **Milestone:** Phase 3 — Scale, Polish & Compliance
>
> Implementation of Real-Time Admin & Partner Analytics Dashboard with interactive charts, 4-step Tenant Self-Serve Onboarding Wizard with DEA & NPI validation and isolated database shard provisioning, Progressive Web App (PWA) with Service Worker offline caching, and Dark Mode theme toggle with WCAG 2.1 AA accessibility.

### Added

#### Backend Routes & Database Methods (`server/`)
- `server/routes/admin.ts` — `GET /api/admin/analytics` (supports `7d`, `30d`, `90d` timeframe aggregations, daily time-series, fulfillment speed distribution, category volume, and fulfiller rankings) and `POST /api/admin/tenants/onboard` (provisions tenant shards, validates credentials, and creates immutable SEC-18 registration certificates).
- `server/db.ts` — `getPlatformAnalytics()` engine and `onboardTenant()` isolated shard allocation and audit hashing.
- `server/test-phase3.ts` — Automated verification suite covering 30d/7d analytics, tenant onboarding, SEC-18 certificates, and audit logs (5/5 tests passing).

#### Frontend Components & Features
- `src/components/AdminAnalyticsDashboard.tsx` — Real-time analytics dashboard with interactive SVG GMV & patient savings time-series area charts, SLA fulfillment speed histograms, medicine category share bars, and CSV report export.
- `src/components/TenantOnboardingModal.tsx` — 4-step pharmacy partner registration wizard: (1) Pharmacy info & DEA/NPI validation, (2) Tier selection & take-rate agreement, (3) Isolated database shard allocation, and (4) SEC-18 registration certificate issuance.
- `public/manifest.json` & `public/favicon.svg` — Web App Manifest for PWA installation with standalone display mode and `#006a6a` theme coloring.
- `public/sw.js` — Service Worker implementing cache-first strategy for static assets and network-first with offline fallback caching for `/api/` medicine catalog.

### Changed
- `src/components/SuperAdminSuite.tsx` — Redesigned with sub-navigation tabs (`analytics`, `tenants`, `audit`) and connected `TenantOnboardingModal`.
- `src/components/NavigationHeader.tsx` & `src/App.tsx` — Added Dark Mode theme switcher (Light / Dark) with `localStorage` synchronization (`gmed_theme`) and system preference detection.
- `src/index.css` — Added dark mode theme tokens (`.dark body`, surface colors) and `:focus-visible` accessibility rings meeting WCAG 2.1 AA.
- `src/types.ts` — Added `PlatformAnalytics`, `AnalyticsTimeSeriesPoint`, `CategoryVolumeStat`, `TenantOnboardingPayload` types.
- `src/services/api.ts` — Added `getPlatformAnalytics()` and `onboardTenant()` client methods with resilient offline fallback calculations.

---

## [0.3.0] — 2026-09-09

> **Milestone:** Phase 2 — Production Features
>
> Implementation of Escrow Payment Processing (Credit Card, Apple Pay, FSA/HSA Debit), Multimodal Prescription OCR & NPI Verification, In-App Notification Center with live SLA Alerts, Patient Live Order Tracking & OTP Verification, and Insurance Eligibility & Copay Comparison.

### Added

#### Backend Routes & Database Methods (`server/`)
- `server/routes/payments.ts` — `POST /api/payments/process` (holds payment in escrow), `GET /api/payments/receipt/:orderId` (generates SEC-18 QR verified receipts), and `POST /api/payments/refund` (releases escrow and cancels order).
- `server/routes/prescriptions.ts` — `POST /api/prescriptions/ocr-scan` (OCR parsing & bioequivalent generic matcher), `GET /api/prescriptions/npi-verify/:npi` (registry verification), and `GET /api/prescriptions` (retrieval).
- `server/routes/notifications.ts` — `GET /api/notifications` (role/user targeted alerts), `PATCH /api/notifications/:id/read`, and `POST /api/notifications/broadcast`.
- `server/routes/insurance.ts` — `POST /api/insurance/verify` (real-time deductible & eligibility verification) and `POST /api/insurance/copay-calculator` (copay vs cash price comparison).
- `server/test-phase2.ts` — Automated verification suite testing payment escrow, receipt generation, NPI validation, notification center, copay calculations, and order refund (6/6 tests passing).

#### Frontend Components & Features
- `src/components/PrescriptionUploadModal.tsx` — Gemini Multimodal Vision Rx scanner modal with drag-and-drop file upload, OCR progress meter, prescriber NPI registry status badge, and instant generic savings match.
- `src/components/InsuranceCalculatorModal.tsx` — Instant brand copay vs generic copay vs genericMed cash price comparison with deductible tracker and plan selector (Commercial PPO, High-Deductible HSA, Medicare Part D, Medicaid).
- `src/components/NotificationCenterModal.tsx` — Real-time notification drawer with unread counter, badge types (price drops, refill reminders, SLA alerts), and one-click mark read actions.
- `src/components/PatientOrderHistory.tsx` — Patient live tracking dashboard with 5-stage dispatch timeline (Placed → TeleRx Verified → Dispensing → Courier Transit → PIN Delivered), courier ETA map status, tamper-evident PIN OTP display, and downloadable SEC-18 receipt viewer.

### Changed
- `src/types.ts` — Added `PaymentIntent`, `ReceiptData`, `PrescriptionRecord`, `InAppNotification`, `InsuranceEligibility` types and added `patient-orders` to `AppView`.
- `src/services/api.ts` — Added all 10 Phase 2 client methods with reliable offline fallbacks.
- `src/components/NavigationHeader.tsx` — Added "4. Track Orders" tab, "Scan Rx" quick button, and live notification bell badge.
- `src/components/CartRevalidation.tsx` — Integrated payment method selector (Card, Apple Pay, FSA/HSA), escrow hold badge, payment processing, and tracking modal handoff.
- `src/components/CustomerHome.tsx` — Connected `PrescriptionUploadModal` and `InsuranceCalculatorModal`.
- `src/App.tsx` — Connected `patient-orders` view, unread notification counter, and modal state management.


## [0.2.0] — 2026-09-09

> **Milestone:** Phase 1 — Backend Foundation
>
> Implementation of the Express REST API server, in-memory multi-tenant DataStore, JWT authentication with role-based access control, Gemini AI integration for drug interactions and intelligent search, and full frontend API integration.

### Added

#### Backend REST API Server (`server/`)
- `server/index.ts` — Main Express server on port 5000 with CORS, JSON parsing, logging, and health endpoint (`GET /api/health`).
- `server/db.ts` — Type-safe `DataStore` with multi-tenant isolation, automatic SEC-18 SHA256 audit trail generation, and inventory synchronization.
- `server/routes/medicines.ts` — `GET /api/medicines` with search/category filters and `GET /api/medicines/:id`.
- `server/routes/offers.ts` — `GET /api/medicines/:id/offers` with distance, SLA, and pricing sort.
- `server/routes/cart.ts` — `POST /api/cart/validate` with live price lock and automated webhook event dispatch.
- `server/routes/orders.ts` — `POST /api/orders` order placement and `GET /api/orders` order listing.
- `server/routes/partner.ts` — `GET /api/partner/orders`, `PATCH /api/partner/orders/:id/status`, and `PATCH /api/partner/orders/:id/scan-item`.
- `server/routes/admin.ts` — `GET /api/admin/tenants` and `GET /api/admin/audit-logs` for HIPAA/SEC-18 compliance.
- `server/routes/dev.ts` — `GET /api/dev/credentials`, `POST /api/dev/credentials`, and `GET /api/dev/webhooks`.
- `server/routes/ai.ts` — `POST /api/ai/drug-check` and `POST /api/ai/search` with rate limiting.
- `server/routes/auth.ts` — `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`, `POST /api/auth/logout`.

#### Middleware & Services
- `server/middleware/auth.ts` — JWT token generation, verification, and role-based route protection (`requireRole`).
- `server/middleware/tenantScope.ts` — Multi-tenant header validation (`x-tenant-id`).
- `server/middleware/rateLimiter.ts` — Sliding-window request rate limiter.
- `server/middleware/errorHandler.ts` — Standardized JSON error response formatting.
- `server/services/gemini.ts` — Server-side `@google/genai` integration with TTL response caching, prompt templates, and clinical disclaimers.
- `server/services/webhook.ts` — Webhook dispatch logger for external event listeners.

#### Frontend API Service Layer
- `src/services/api.ts` — Centralized, typed API client methods for all 18+ endpoints with automatic token header injection and reliable offline fallback.

### Changed
- `src/components/CustomerHome.tsx` — Integrated with `api.getMedicines()` and added Gemini AI smart search action.
- `src/components/DrugEquivalency.tsx` — Integrated with `api.getOffers()` and live Gemini AI drug safety interaction check.
- `src/components/CartRevalidation.tsx` — Integrated with `api.validateCart()` and `api.createOrder()`.
- `src/components/PartnerPortal.tsx` — Integrated with `api.getPartnerOrders()` and live dispensing status dispatch.
- `src/components/SuperAdminSuite.tsx` — Integrated with `api.getTenants()` and `api.getAuditLogs()`.
- `src/components/DevConsole.tsx` — Integrated with `api.getApiCredentials()`, `api.createApiCredential()`, and `api.getWebhookEvents()`.
- `src/components/AuthScreen.tsx` — Integrated with `api.login()` and `api.register()` issuing real JWT tokens.
- `src/App.tsx` — Rehydrates active authenticated session on load via `api.getMe()`, persists cart to `localStorage`.
- `vite.config.ts` — Configured `/api` proxy forwarding to `http://localhost:5000`.
- `package.json` — Added `"server": "tsx server/index.ts"` run script and backend dependencies (`cors`, `jsonwebtoken`, `bcryptjs`).

## [0.1.0] — 2026-09-08

> **Milestone:** Initial MVP / Prototype Release
>
> Complete frontend prototype with mock data, multi-role authentication, and all core views.

### Added

#### Core Architecture
- React 19 + Vite 6 + TypeScript 5.8 project scaffolding
- Tailwind CSS v4 integration with `@tailwindcss/vite` plugin
- Material 3-inspired `@theme` color token system in `index.css`
- Custom typography scale (10 utility classes: `font-display-lg` through `font-badge-micro`)
- Google Fonts integration: Inter (body), Plus Jakarta Sans (headlines), Material Symbols Outlined (icons)
- ESM module setup with `"type": "module"` in `package.json`
- TypeScript path aliasing (`@/` → project root) via `tsconfig.json` and Vite config
- HMR toggle support via `DISABLE_HMR` environment variable (for AI Studio compatibility)

#### Data Layer
- `src/types.ts` — 10 TypeScript interfaces covering all domain entities
- `src/data/mockData.ts` — Comprehensive mock data with 8 exported constants:
  - `MEDICINES_DATA` (4 medicines: Atorvastatin, Metformin, Amoxicillin, Acetaminophen)
  - `PHARMACY_OFFERS` (4 pharmacy offers with SLA and stock data)
  - `INITIAL_CART_ITEMS` (2 pre-loaded cart items)
  - `PARTNER_ORDERS_DATA` (3 orders across urgency levels)
  - `TENANT_ORGS_DATA` (5 tenant organizations across all tiers)
  - `AUDIT_LOGS_DATA` (4 SEC-18 audit entries)
  - `API_CREDENTIALS_DATA` (3 API keys: 2 production, 1 sandbox)
  - `WEBHOOK_EVENTS_DATA` (3 recent webhook dispatches)

#### Components (9 total)
- `App.tsx` — Root component with centralized state management and view routing
- `NavigationHeader.tsx` — Universal top navigation with role-gated view tabs
- `CustomerHome.tsx` — Medicine search, listing, and add-to-cart functionality
- `DrugEquivalency.tsx` — Drug detail page with pharmacy offer comparison table
- `CartRevalidation.tsx` — Shopping cart with price revalidation and checkout flow
- `PartnerPortal.tsx` — Pharmacist order queue with dispensing workflow
- `SuperAdminSuite.tsx` — Multi-tenant admin dashboard with health monitoring
- `DevConsole.tsx` — API credential and webhook management console
- `ArchitecturePrd.tsx` — System architecture documentation viewer
- `AuthScreen.tsx` — Multi-role authentication with demo profile switching

#### Authentication & Authorization
- Client-side `UserProfile` state with 4 roles: `patient`, `pharmacist`, `developer`, `superadmin`
- Role-based view access control in `NavigationHeader`
- Auth screen with login/logout and role-appropriate view redirection
- Demo user profiles for each role

#### Business Logic
- Generic vs. brand price comparison engine with savings calculation
- Cart quantity management with add/update/remove
- Multi-tenant SLA monitoring with automated breach alerting (mock)
- Platform fee model with configurable take rates per tenant tier
- Order dispensing state machine: Received → Dispensing → Ready/Staged
- Prescriber verification display with NPI and TeleRx status

#### Configuration
- `.env.example` with `GEMINI_API_KEY` and `APP_URL` placeholders
- `.gitignore` covering `node_modules/`, `dist/`, `.env*`, logs, and macOS artifacts
- `metadata.json` with project name, description, and `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`
- `index.html` with SEO meta tags, Open Graph, and Twitter Card markup

#### Dependencies
- Production: `react`, `react-dom`, `@google/genai`, `@tailwindcss/vite`, `@vitejs/plugin-react`, `lucide-react`, `motion`, `express`, `dotenv`
- Dev: `typescript`, `tailwindcss`, `autoprefixer`, `esbuild`, `tsx`, `@types/node`, `@types/express`

### Changed
- _(initial release — no prior version)_

### Fixed
- _(initial release — no prior version)_

---

## Changelog Entry Template

<!--
Copy this block for each new version or set of changes:

## [X.Y.Z] — YYYY-MM-DD

> **Milestone:** Brief description of what this release accomplishes.

### Added
- Description of new feature or file added

### Changed
- Description of what was modified and why

### Fixed
- Description of bug that was fixed (reference issue # if applicable)

### Removed
- Description of what was deleted and why

### Security
- Description of security fix or improvement
-->

---

> **📝 How to maintain this changelog:**
> 1. **During development:** Add entries to `[Unreleased]` as you make changes.
> 2. **On release:** Move `[Unreleased]` entries into a new version block with today's date.
> 3. **Version numbering:**
>    - `MAJOR` (1.0.0) — Breaking changes, major architecture shifts.
>    - `MINOR` (0.2.0) — New features, non-breaking additions.
>    - `PATCH` (0.1.1) — Bug fixes, minor tweaks.
> 4. **Commit message:** `docs(changelog): add vX.Y.Z release notes`.
