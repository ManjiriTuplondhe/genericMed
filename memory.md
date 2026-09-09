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

### Partner / Pharmacist Features
- [x] Partner portal with order queue management
- [x] Order urgency categorization (urgent-2h, curbside-ready, new-received, completed)
- [x] Dispensing workflow with barcode scan tracking
- [x] Prescriber verification display (NPI, specialty, TeleRx status)
- [x] Courier tracking with ETA and geo-status
- [x] Customer PIN verification for pickup
- [x] Financial breakdown per order (patient total, platform fee, net payout)

### Admin Features
- [x] Super Admin suite with multi-tenant organization overview
- [x] Tenant tier management (Enterprise, Standard, Regional, Starter, Sandbox)
- [x] Node health monitoring with shard/replica lag visibility
- [x] SLA rate tracking per tenant
- [x] Compliance status badges (HIPAA & DEA, Verified, SLA Warning, DEA Under Review)
- [x] SEC-18 audit log viewer (tenant isolation, NDC sync, commission settlement, SLA breach)

### Developer Features
- [x] Developer console with API credential management
- [x] API key viewer with scoped permissions display
- [x] Webhook event log with response codes and latency
- [x] Sandbox vs. production key differentiation

### System Features
- [x] Multi-role authentication screen (Patient, Pharmacist, Developer, Superadmin)
- [x] Role-based navigation (view access gated by user role)
- [x] System architecture / PRD viewer component
- [x] Responsive navigation header with cart badge and order count

### Design System
- [x] Material 3-inspired color token system with `@theme`
- [x] Custom typography scale (10 utility classes)
- [x] Hidden scrollbar utility classes
- [x] Google Fonts integration (Inter + Plus Jakarta Sans + Material Symbols)

---

## Pending Features

### High Priority
- [ ] Real backend API (Express server with database)
- [ ] Server-side Gemini AI integration (drug interaction checks, smart search)
- [ ] Production authentication (OAuth / Firebase Auth)
- [ ] Client-side routing (React Router or similar) with URL deep-linking
- [ ] Real-time price fetching from pharmacy APIs
- [ ] Payment processing integration (Stripe or similar)

### Medium Priority
- [ ] Search with autocomplete and fuzzy matching
- [ ] Prescription upload / OCR scanning
- [ ] Insurance coverage checker
- [ ] Order history for patients
- [ ] Push notifications for order status updates
- [ ] Admin analytics dashboard with charts
- [ ] Tenant onboarding wizard

### Low Priority
- [ ] PWA support (offline caching, install prompt)
- [ ] Dark mode theme
- [ ] Localization / i18n (multilingual support)
- [ ] Accessibility audit and WCAG 2.1 AA compliance
- [ ] End-to-end testing with Playwright
- [ ] CI/CD pipeline setup
- [ ] Performance monitoring (Core Web Vitals tracking)

---

## Component Map

| Component File                                                                                                          | Description                                        | Key Props / State                       |
|-------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|-----------------------------------------|
| [`App.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/App.tsx)                                      | Root component, state management, view router      | `currentView`, `cartItems`, `currentUser` |
| [`NavigationHeader.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/NavigationHeader.tsx)  | Top nav bar with role-gated view tabs               | `currentView`, `cartCount`, `currentUser` |
| [`CustomerHome.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/CustomerHome.tsx)          | Medicine search, listing, add-to-cart               | `onNavigateToDetail`, `onAddToCart`       |
| [`DrugEquivalency.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/DrugEquivalency.tsx)    | Drug detail with pharmacy offer comparison          | `onBack`, `onProceedToCart`               |
| [`CartRevalidation.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/CartRevalidation.tsx)  | Cart with price revalidation and checkout           | `cartItems`, `onUpdateQuantity`           |
| [`PartnerPortal.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/PartnerPortal.tsx)        | Pharmacist order queue and dispensing workflow      | Self-contained (uses mock data directly)  |
| [`SuperAdminSuite.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/SuperAdminSuite.tsx)    | Multi-tenant admin dashboard                        | Self-contained (uses mock data directly)  |
| [`DevConsole.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/DevConsole.tsx)              | API credentials and webhook management              | Self-contained (uses mock data directly)  |
| [`ArchitecturePrd.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/ArchitecturePrd.tsx)    | System architecture documentation viewer            | Self-contained                            |
| [`AuthScreen.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/components/AuthScreen.tsx)              | Login/logout with role selection                    | `onLogin`, `onLogout`, `onCancel`         |

---

## Data Model / Schema Summary

> All interfaces defined in [`types.ts`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/types.ts).

### Core Entities

```typescript
// View routing
type AppView = 'customer-search' | 'customer-drug-detail' | 'customer-cart'
             | 'partner-portal' | 'super-admin' | 'dev-console'
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

> ✅ **Backend REST API is fully implemented** on Express (`server/index.ts`) with multi-tenant data store (`server/db.ts`), JWT auth & RBAC, and Gemini AI integration.

### Implemented REST API

| Method | Endpoint                         | Description                          | Status       |
|--------|----------------------------------|--------------------------------------|--------------|
| GET    | `/api/health`                    | Service health and uptime status     | ✅ Live      |
| GET    | `/api/medicines`                 | List all medicines with filters      | ✅ Live      |
| GET    | `/api/medicines/:id`             | Get medicine detail with offers      | ✅ Live      |
| GET    | `/api/medicines/:id/offers`      | Get pharmacy offers for a medicine   | ✅ Live      |
| POST   | `/api/cart/validate`             | Revalidate cart prices in real-time  | ✅ Live      |
| POST   | `/api/orders`                    | Place a new order                    | ✅ Live      |
| GET    | `/api/orders`                    | List placed orders                   | ✅ Live      |
| GET    | `/api/partner/orders`            | Get partner order queue              | ✅ Live      |
| PATCH  | `/api/partner/orders/:id/status` | Update order dispensing status       | ✅ Live      |
| PATCH  | `/api/partner/orders/:id/scan-item` | Scan barcode verification item     | ✅ Live      |
| GET    | `/api/admin/tenants`             | List all tenant organizations        | ✅ Live      |
| GET    | `/api/admin/audit-logs`          | Get SEC-18 audit trail               | ✅ Live      |
| GET    | `/api/dev/credentials`           | List scoped developer API keys       | ✅ Live      |
| POST   | `/api/dev/credentials`           | Generate new API credential          | ✅ Live      |
| GET    | `/api/dev/webhooks`              | List webhook dispatch delivery log   | ✅ Live      |
| POST   | `/api/ai/drug-check`             | Gemini AI drug interaction check     | ✅ Live      |
| POST   | `/api/ai/search`                 | Gemini AI powered medicine search    | ✅ Live      |
| POST   | `/api/auth/login`                | Authenticate user & issue JWT        | ✅ Live      |
| POST   | `/api/auth/register`             | Register user with bcrypt hashing    | ✅ Live      |
| GET    | `/api/auth/me`                   | Verify active token session          | ✅ Live      |
| POST   | `/api/auth/logout`               | Revoke token session                 | ✅ Live      |

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
