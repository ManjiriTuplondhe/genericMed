# 🧠 Project Memory — genericMed

> **Purpose:** Long-term memory for AI coding assistants. This file is the **single source of truth** for the current state of the project. Read this file first before making any changes.
>
> **Last Updated:** 2026-09-08

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Features Completed](#features-completed)
- [Pending Features](#pending-features)
- [Component Map](#component-map)
- [Data Model / Schema Summary](#data-model--schema-summary)
- [API Endpoints](#api-endpoints)
- [Important Business Logic](#important-business-logic)
- [Environment Configuration](#environment-configuration)
- [Known Issues](#known-issues)
- [Future Roadmap](#future-roadmap)

---

## Project Overview

| Field              | Detail |
|--------------------|--------|
| **Project Name**   | genericMed |
| **Description**    | Multi-Tenant SaaS Platform for Online Generic Medicine Price Comparison, Dispensing Verification, and Purchase |
| **Target Users**   | Patients, Pharmacists, Developers (API consumers), Super Admins |
| **Status**         | Prototype / MVP — frontend-only with mock data |
| **Repository**     | `genericMed` |
| **Live URL**       | Configured via `APP_URL` environment variable |

### Value Proposition
genericMed helps patients find the **cheapest FDA-approved generic equivalents** of branded medicines, compare prices across local pharmacies, and purchase with verified dispensing — all while providing pharmacy partners with an order management portal, developers with API access, and platform operators with multi-tenant admin tools.

---

## Tech Stack

### Frontend

| Technology               | Version   | Purpose                                    |
|--------------------------|-----------|--------------------------------------------|
| **React**                | 19.x      | UI framework (functional components, hooks)|
| **TypeScript**           | 5.8.x     | Type safety across all source files        |
| **Vite**                 | 6.x       | Build tool, dev server, HMR                |
| **Tailwind CSS**         | 4.x       | Utility-first CSS with `@theme` tokens     |
| **Motion (Framer)**      | 12.x      | Animations and transitions                 |
| **Lucide React**         | 0.546.x   | Icon library (supplementary)               |
| **Material Symbols**     | CDN       | Primary icon system (Outlined variant)     |
| **Inter**                | CDN       | Body typography (Google Fonts)             |
| **Plus Jakarta Sans**    | CDN       | Headline typography (Google Fonts)         |

### Backend (Planned / Partial)

| Technology               | Version   | Purpose                                    |
|--------------------------|-----------|--------------------------------------------|
| **Express**              | 4.x       | HTTP server for Gemini API proxy           |
| **@google/genai**        | 2.4.x     | Gemini AI SDK for server-side AI calls     |
| **dotenv**               | 17.x      | Environment variable loading               |

### Dev Tools

| Technology               | Version   | Purpose                                    |
|--------------------------|-----------|--------------------------------------------|
| **esbuild**              | 0.25.x    | Fast JS/TS bundling (used by Vite)         |
| **tsx**                   | 4.x      | TypeScript execution for scripts           |
| **autoprefixer**         | 10.x      | CSS vendor prefixing                       |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                    index.html                         │
│           (Meta tags, fonts, viewport)                │
├──────────────────────────────────────────────────────┤
│                     main.tsx                          │
│              (ReactDOM.createRoot)                    │
├──────────────────────────────────────────────────────┤
│                     App.tsx                           │
│     ┌─────────────────────────────────────┐          │
│     │  State: currentView, cartItems,     │          │
│     │         currentUser, selectedMedId  │          │
│     └─────────────┬───────────────────────┘          │
│                   │                                   │
│     ┌─────────────▼───────────────────────┐          │
│     │       NavigationHeader              │          │
│     │  (Role-gated view switcher)         │          │
│     └─────────────────────────────────────┘          │
│                                                       │
│     ┌─── View Router (AppView state) ────┐           │
│     │                                     │           │
│     │  customer-search → CustomerHome     │           │
│     │  customer-drug-detail → DrugEquiv.  │           │
│     │  customer-cart → CartRevalidation   │           │
│     │  partner-portal → PartnerPortal    │           │
│     │  super-admin → SuperAdminSuite     │           │
│     │  dev-console → DevConsole          │           │
│     │  system-architecture → Arch.PRD    │           │
│     │  auth → AuthScreen                 │           │
│     └─────────────────────────────────────┘           │
├──────────────────────────────────────────────────────┤
│               mockData.ts (Data Layer)                │
│  MEDICINES_DATA | PHARMACY_OFFERS | PARTNER_ORDERS    │
│  TENANT_ORGS | AUDIT_LOGS | API_CREDENTIALS | WEBHOOKS│
└──────────────────────────────────────────────────────┘
```

---

## Features Completed

### Customer Features
- [x] Medicine search and listing (4 medicines: Atorvastatin, Metformin, Amoxicillin, Acetaminophen)
- [x] Generic vs. brand price comparison with savings percentages
- [x] Drug equivalency detail view with FDA bioequivalent ratings
- [x] Pharmacy offer comparison (price, distance, SLA, stock status)
- [x] Shopping cart with quantity management
- [x] Cart revalidation flow (price verification before checkout)
- [x] Brand MSRP vs. generic price display
- [x] Prescription Upload & Multimodal OCR scanner with bioequivalent generic matching
- [x] Prescriber NPI Registry real-time verification modal
- [x] Insurance eligibility verification & 3-way copay savings calculator
- [x] Patient Live Order History & Tracking dashboard with 5-stage timeline and customer PIN OTP
- [x] Payment checkout with escrow model (Credit Card, Apple Pay, FSA/HSA Debit Card)
- [x] SEC-18 Prescription Dispensing Receipt generation with verifiable QR code

### Partner / Pharmacist Features
- [x] Partner portal with order queue management
- [x] Order urgency categorization (urgent-2h, curbside-ready, new-received, completed)
- [x] Dispensing workflow with barcode scan tracking
- [x] Prescriber verification display (NPI, specialty, TeleRx status)
- [x] Courier tracking with ETA and geo-status
- [x] Customer PIN verification for pickup
- [x] Financial breakdown per order (patient total, platform fee, net payout)

### Admin & Super Admin Features
- [x] Super Admin suite with multi-tenant organization overview
- [x] Tenant tier management (Enterprise, Standard, Regional, Starter, Sandbox)
- [x] Node health monitoring with shard/replica lag visibility
- [x] SLA rate tracking per tenant
- [x] Compliance status badges (HIPAA & DEA, Verified, SLA Warning, DEA Under Review)
- [x] SEC-18 audit log viewer (tenant isolation, NDC sync, commission settlement, SLA breach)
- [x] Real-time Admin & Partner Analytics Dashboard with interactive SVG volume trends, SLA speed distribution, category volume, and CSV report export
- [x] 4-Step Self-Serve Tenant Onboarding Wizard with DEA & NPI credential validation, automatic database shard allocation, and SEC-18 registration certificate issuance

### Enterprise & Marketplace Features (Phase 4)
- [x] Pharmacy PMS Integration Marketplace (QS/1, PioneerRx, Liberty Software, Rx30, Epic Willow) with bidirectional sync and connection management
- [x] Multi-Drug Clinical Interaction Matrix with simultaneous pairwise CYP450 enzyme conflict detection and FDA Orange Book citations
- [x] 24/7 Patient Clinical Support Assistant (Gemini AI powered) with action shortcuts and pharmacist escalation
- [x] Multi-Region Cluster Topology & Replication Monitoring (US-East, US-West, US-Central, EU-West) with zero-downtime disaster recovery failover simulation
- [x] Real-time Fraud Detection & DEA Velocity Engine with prescriber NPI surveillance, geo-anomalies, and SEC-18 immutable audit tracking

### Developer Features
- [x] Developer console with API credential management
- [x] API key viewer with scoped permissions display
- [x] Webhook event log with response codes and latency
- [x] Sandbox vs. production key differentiation

### System Features
- [x] Multi-role authentication screen (Patient, Pharmacist, Developer, Superadmin)
- [x] Role-based navigation (view access gated by user role)
- [x] System architecture / PRD viewer component
- [x] Responsive navigation header with cart badge, unread notification counter, quick Rx scan, and Phase 4 action triggers
- [x] In-app notification center modal with live SLA & price-drop alert broadcasting
- [x] Progressive Web App (PWA) support with service worker offline caching and Web App Manifest (`manifest.json`)
- [x] Dark Mode theme toggle with system preference sync and persistent `localStorage` storage (`gmed_theme`)
- [x] WCAG 2.1 AA accessible focus rings and high-contrast color tokens

### Design System
- [x] Material 3-inspired color token system with `@theme`
- [x] Custom typography scale (10 utility classes)
- [x] Hidden scrollbar utility classes
- [x] Google Fonts integration (Inter + Plus Jakarta Sans + Material Symbols)

---

## Pending Features

### High Priority
- [ ] Native Mobile App shell (React Native wrapper for App Store / Play Store distribution)
- [ ] Multi-language i18n localization (Spanish `es-US`, Mandarin `zh-CN`)
- [ ] Third-party SOC 2 Type II audit report packaging

---

## Component Map

| Component File | Description | Key Props / State |
|---|---|---|
| [`App.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/App.tsx) | Root component, state management, view router, dark mode sync | `currentView`, `cartItems`, `currentUser`, `selectedMedId`, `theme` |
| [`NavigationHeader.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/NavigationHeader.tsx) | Top nav bar with role-gated view tabs, dark mode toggle, and Phase 4 modal triggers | `currentView`, `cartCount`, `currentUser`, `onOpenNotifications`, `onOpenPrescription`, `onOpenClinicalAssistant`, `onOpenMultiDrugModal`, `onOpenMarketplaceModal`, `onOpenMultiRegionModal`, `theme`, `onToggleTheme` |
| [`CustomerHome.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/CustomerHome.tsx) | Medicine search, listing, add-to-cart, Rx scan CTA | `onNavigateToDetail`, `onAddToCart`, `onOpenPrescription`, `onOpenInsurance` |
| [`DrugEquivalency.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/DrugEquivalency.tsx) | Drug detail with pharmacy offer comparison & AI safety | `onBack`, `onProceedToCart` |
| [`CartRevalidation.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/CartRevalidation.tsx) | Cart with price revalidation, payment escrow, checkout | `cartItems`, `onUpdateQuantity`, `onOrderPlaced` |
| [`PatientOrderHistory.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/PatientOrderHistory.tsx) | Live order tracking dashboard, timeline, PIN OTP, SEC-18 receipt | `onBackToSearch`, `onCancelOrder` |
| [`PrescriptionUploadModal.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/PrescriptionUploadModal.tsx) | Gemini OCR scanner, NPI verification, generic matcher | `isOpen`, `onClose`, `onSelectMedicine` |
| [`InsuranceCalculatorModal.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/InsuranceCalculatorModal.tsx) | Real-time insurance eligibility & 3-way copay calculator | `isOpen`, `onClose` |
| [`NotificationCenterModal.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/NotificationCenterModal.tsx) | In-app notification drawer with unread counter | `isOpen`, `onClose` |
| [`PharmacyMarketplaceModal.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/PharmacyMarketplaceModal.tsx) | Pharmacy Management System (PMS) connectors & sync | `isOpen`, `onClose` |
| [`MultiDrugInteractionModal.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/MultiDrugInteractionModal.tsx) | Multi-drug CYP450 interaction matrix & CPIC checker | `isOpen`, `onClose`, `preselectedMedicineId` |
| [`PatientClinicalAssistantModal.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/PatientClinicalAssistantModal.tsx) | 24/7 AI conversational medication assistant drawer | `isOpen`, `onClose`, `onNavigate`, `onOpenMultiDrug` |
| [`MultiRegionStatusModal.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/MultiRegionStatusModal.tsx) | Global multi-region replication & disaster recovery failover | `isOpen`, `onClose` |
| [`PartnerPortal.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/PartnerPortal.tsx) | Pharmacist order queue and dispensing workflow | Self-contained (uses live API) |
| [`SuperAdminSuite.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/SuperAdminSuite.tsx) | Multi-tenant admin dashboard with sub-tabs (Analytics, Tenants, Audit) & onboarding trigger | Self-contained (uses live API) |
| [`AdminAnalyticsDashboard.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/AdminAnalyticsDashboard.tsx) | Interactive SVG volume/savings charts, SLA distribution, fulfiller rankings, CSV export | `timeframe`, `onTimeframeChange` |
| [`TenantOnboardingModal.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/TenantOnboardingModal.tsx) | 4-step pharmacy partner self-onboarding wizard with DEA/NPI validation & certificate generator | `isOpen`, `onClose`, `onTenantCreated` |
| [`DevConsole.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/DevConsole.tsx) | API credentials and webhook management | Self-contained (uses live API) |
| [`ArchitecturePrd.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/ArchitecturePrd.tsx) | System architecture documentation viewer | Self-contained |
| [`AuthScreen.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/AuthScreen.tsx) | Login/logout with role selection & JWT auth | `onLogin`, `onLogout`, `onCancel` |

---

## Data Model / Schema Summary

> All interfaces defined in [`types.ts`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/types.ts).

### Core Entities

```typescript
// View routing
type AppView = 'customer-search' | 'customer-drug-detail' | 'customer-cart'
             | 'patient-orders' | 'partner-portal' | 'super-admin' | 'dev-console'
             | 'system-architecture' | 'auth';

// User roles
type UserRole = 'patient' | 'pharmacist' | 'developer' | 'superadmin';
```

### Entity Relationship Diagram

```
UserProfile (1) ──────── (*) CartItem
    │                          │
    │                          │ medicineId
    │                          ▼
    │                     Medicine (1) ──── (*) PharmacyOffer
    │
    └─── role ──► AppView access control
                      │
                      ├── patient    → customer-search, customer-drug-detail, customer-cart
                      ├── pharmacist → partner-portal
                      ├── developer  → dev-console
                      └── superadmin → super-admin

PartnerOrder ──── items[] ──── prescriber ──── financials
TenantOrg ──── Sec18AuditLog (via multi-tenant system)
ApiCredential ──── WebhookEvent (via dev console)
```

### Key Interfaces Summary

| Interface        | Key Fields                                                      | Record Count (Mock) |
|------------------|-----------------------------------------------------------------|---------------------|
| `UserProfile`    | `id`, `name`, `email`, `role`, `orgName`, `zipCode`            | 1 (active session)  |
| `Medicine`       | `id`, `genericName`, `brandName`, `brandPrice`, `lowestPrice`, `ndc` | 4                   |
| `PharmacyOffer`  | `pharmacyName`, `price`, `slaMinutes`, `inStock`, `distanceMiles` | 4                   |
| `CartItem`       | `medicineId`, `price`, `quantity`, `brandMSRP`, `ndc`          | 2 (initial)         |
| `PartnerOrder`   | `orderId`, `urgency`, `status`, `items[]`, `prescriber`, `financials` | 3                   |
| `TenantOrg`      | `slug`, `tier`, `takeRate`, `shard`, `slaRate`, `complianceStatus` | 5                   |
| `Sec18AuditLog`  | `type`, `summary`, `sha256`, `statusBadge`                     | 4                   |
| `ApiCredential`  | `keyPrefix`, `scopes[]`, `status`                              | 3                   |
| `WebhookEvent`   | `topic`, `responseCode`, `latencyMs`                           | 3                   |

---

## API Endpoints

> ✅ **Backend REST API v0.3.0 is fully implemented** on Express (`server/index.ts`) with multi-tenant data store (`server/db.ts`), JWT auth & RBAC, Gemini AI integration, payment escrow, prescription OCR, notifications, and insurance verification.

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/health` | Service health and uptime status | ✅ Live |
| GET | `/api/medicines` | List all medicines with filters | ✅ Live |
| GET | `/api/medicines/:id` | Get medicine detail with offers | ✅ Live |
| GET | `/api/medicines/:id/offers` | Get pharmacy offers for a medicine | ✅ Live |
| POST | `/api/cart/validate` | Revalidate cart prices in real-time | ✅ Live |
| POST | `/api/orders` | Place a new order with escrow hold | ✅ Live |
| GET | `/api/orders` | List placed orders / patient history | ✅ Live |
| POST | `/api/orders/:id/cancel` | Cancel order & release payment escrow | ✅ Live |
| GET | `/api/partner/orders` | Get partner order queue | ✅ Live |
| PATCH | `/api/partner/orders/:id/status` | Update order dispensing status | ✅ Live |
| PATCH | `/api/partner/orders/:id/scan-item` | Scan barcode verification item | ✅ Live |
| POST | `/api/payments/process` | Authorize and hold funds in escrow | ✅ Live |
| GET | `/api/payments/receipt/:orderId` | Generate SEC-18 certified receipt & QR | ✅ Live |
| POST | `/api/payments/refund` | Refund payment and release escrow | ✅ Live |
| POST | `/api/prescriptions/ocr-scan` | Multimodal OCR scan & generic match | ✅ Live |
| GET | `/api/prescriptions/npi-verify/:npi` | Verify prescriber NPI registry status | ✅ Live |
| GET | `/api/prescriptions` | List user prescription history | ✅ Live |
| GET | `/api/notifications` | List user in-app notifications | ✅ Live |
| PATCH | `/api/notifications/:id/read` | Mark in-app notification as read | ✅ Live |
| POST | `/api/notifications/broadcast` | Broadcast SLA breach / price alert | ✅ Live |
| POST | `/api/insurance/verify` | Real-time insurance eligibility check | ✅ Live |
| POST | `/api/insurance/copay-calculator` | 3-way copay & tier pricing comparison | ✅ Live |
| GET | `/api/admin/tenants` | List all tenant organizations | ✅ Live |
| POST | `/api/admin/tenants/onboard` | Self-serve onboarding & shard provisioning | ✅ Live |
| GET | `/api/admin/analytics` | Platform GMV, savings & SLA analytics | ✅ Live |
| GET | `/api/admin/audit-logs` | Get SEC-18 audit trail | ✅ Live |
| GET | `/api/dev/credentials` | List scoped developer API keys | ✅ Live |
| POST | `/api/dev/credentials` | Generate new API credential | ✅ Live |
| GET | `/api/dev/webhooks` | List webhook dispatch delivery log | ✅ Live |
| POST | `/api/ai/drug-check` | Gemini AI drug interaction check | ✅ Live |
| POST | `/api/ai/multi-drug-check` | Multi-drug CYP450 interaction matrix check | ✅ Live |
| POST | `/api/ai/patient-chat` | 24/7 Patient Clinical Support Assistant (Gemini) | ✅ Live |
| POST | `/api/ai/search` | Gemini AI powered medicine search | ✅ Live |
| GET | `/api/marketplace/adapters` | List Pharmacy Management System (PMS) connectors | ✅ Live |
| POST | `/api/marketplace/adapters/:id/sync` | On-demand PMS inventory & dispensing sync | ✅ Live |
| POST | `/api/marketplace/adapters/:id/configure` | Configure PMS authentication & polling | ✅ Live |
| GET | `/api/regions/status` | Global multi-region replication & cluster topology | ✅ Live |
| POST | `/api/regions/simulate-failover` | Zero-downtime disaster recovery failover simulation | ✅ Live |
| GET | `/api/fraud/alerts` | List active fraud velocity & DEA compliance alerts | ✅ Live |
| POST | `/api/fraud/evaluate` | Real-time order risk & DEA schedule velocity scoring | ✅ Live |
| POST | `/api/auth/login` | Authenticate user & issue JWT | ✅ Live |
| POST | `/api/auth/register` | Register user with bcrypt hashing | ✅ Live |
| GET | `/api/auth/me` | Verify active token session | ✅ Live |
| POST | `/api/auth/logout` | Revoke token session | ✅ Live |

### Webhook Topics (Designed)

| Topic                | Trigger                              |
|----------------------|--------------------------------------|
| `order.created`      | New order placed by patient          |
| `order.dispensed`    | Pharmacist completes dispensing      |
| `price.revalidated`  | Cart prices updated from source      |

---

## Important Business Logic

### 1. Price Comparison Model
- Every `Medicine` has a `brandPrice` (MSRP of brand-name drug) and `lowestPrice` (cheapest generic).
- `savingsPercent` and `savingsAmount` are pre-calculated: `savingsAmount = brandPrice - lowestPrice`.
- Multiple `PharmacyOffer`s exist per medicine with different prices, SLAs, and stock statuses.

### 2. Cart Revalidation Flow
- Before checkout, the cart undergoes **price revalidation** to confirm prices haven't changed.
- Each `CartItem` stores `brandMSRP` (benchmark) and current `price` for savings display.
- Quantity changes are handled by `handleUpdateQuantity(id, delta)` — items are removed when quantity reaches 0.

### 3. Multi-Tenant Architecture
- Each pharmacy partner is a **tenant** (`TenantOrg`) with isolated data via `schemaKey`.
- Tenants operate on database shards (`us-east-db-01`, `us-east-db-02`, etc.).
- **Take rate** (platform fee %) varies by tier: Enterprise (12%), Standard (11.5%), Regional (12.5%), Starter (10%).
- SLA compliance is tracked per tenant; falling below threshold triggers automated `SLA GUARD BREACH` alerts.

### 4. Order Dispensing Workflow
- Orders flow through states: `Just Received` → `Needs Dispensing` → `Ready in Locker` / `Packed & Staged`.
- Each order item requires barcode scanning (`scanned: boolean`).
- Prescriber verification includes NPI validation and TeleRx check.
- Courier tracking provides real-time ETA and geo-status.

### 5. Platform Fee Model
- Platform fee is a percentage of patient total (tied to tenant's `takeRate`).
- `netPayout = patientTotal - platformFee`.
- Commission settlements are batched and audited (see `COMMISSION SETTLEMENT RUN` audit logs).

### 6. User Role Access Matrix

| View                  | Patient | Pharmacist | Developer | Superadmin |
|-----------------------|---------|------------|-----------|------------|
| Customer Search       | ✅      | ✅         | ✅        | ✅         |
| Drug Detail           | ✅      | ✅         | ✅        | ✅         |
| Cart                  | ✅      | ❌         | ❌        | ✅         |
| Partner Portal        | ❌      | ✅         | ❌        | ✅         |
| Super Admin Suite     | ❌      | ❌         | ❌        | ✅         |
| Dev Console           | ❌      | ❌         | ✅        | ✅         |
| System Architecture   | ❌      | ❌         | ✅        | ✅         |

---

## Environment Configuration

| Variable         | Required | Default          | Description                               |
|------------------|----------|------------------|-------------------------------------------|
| `GEMINI_API_KEY` | Yes      | —                | Google Gemini API key (server-side only)   |
| `APP_URL`        | Yes      | —                | Deployed application URL                  |
| `DISABLE_HMR`    | No       | `false`          | Disables Vite HMR (for AI Studio)         |

### Scripts

| Command            | Description                                     |
|--------------------|-------------------------------------------------|
| `npm run dev`      | Start Vite dev server on port 3000              |
| `npm run build`    | Production build to `dist/`                      |
| `npm run preview`  | Preview production build                         |
| `npm run clean`    | Remove `dist/` and `server.js`                   |
| `npm run lint`     | TypeScript type-check (tsc --noEmit)             |

---

## Known Issues

| #  | Issue                                        | Severity | Status    |
|----|----------------------------------------------|----------|-----------|
| 1  | No browser back-button support (no router)   | Medium   | Open      |
| 2  | `handleCompleteCheckout` is a no-op stub     | Medium   | Open      |
| 3  | Cart state resets on page refresh (no persistence) | Medium   | Open      |
| 4  | Auth is client-side only — not secure for production | High     | Open      |
| 5  | Some components exceed 400 lines (e.g., AuthScreen at 50KB) | Low      | Open      |
| 6  | No error boundaries — unhandled errors crash the entire app | Medium   | Open      |
| 7  | Image URLs depend on external `lh3.googleusercontent.com` CDN | Low      | Open      |
| 8  | Mobile responsiveness not fully tested across all views | Medium   | Open      |

---

## Future Roadmap

> **📌 Detailed deliverables, dependencies, and success criteria for each phase are in [`phases.md`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/phases.md).**

### Phase 1 — Backend Foundation (Next)
- [ ] Set up Express server with API routes
- [ ] Implement PostgreSQL database with tenant isolation
- [ ] Migrate mock data to database seeders
- [ ] Add Gemini AI endpoints (drug check, smart search)
- [ ] Implement JWT-based authentication

### Phase 2 — Production Features
- [ ] Real-time pharmacy inventory integration
- [ ] Payment processing (Stripe)
- [ ] Email/SMS notifications for order updates
- [ ] Prescription upload with OCR
- [ ] Insurance eligibility verification API

### Phase 3 — Scale & Polish
- [ ] Admin analytics with charting (Recharts or D3)
- [ ] Tenant onboarding self-serve wizard
- [ ] PWA with offline support
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Dark mode theme support

### Phase 4 — Enterprise
- [ ] HIPAA compliance audit and certification
- [ ] Multi-region deployment
- [ ] Advanced fraud detection
- [ ] Marketplace for third-party pharmacy integrations
- [ ] Mobile apps (React Native)

---

> **📝 How to update this file:**
> 1. After completing a feature, move it from **Pending** to **Completed** with `[x]`.
> 2. After adding an API endpoint, update the **API Endpoints** table.
> 3. After finding a bug, add it to **Known Issues**.
> 4. After fixing a bug, mark it as `Resolved` in the Status column.
> 5. Commit with message: `docs(memory): update <section> — <what changed>`.
