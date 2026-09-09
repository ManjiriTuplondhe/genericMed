# 📋 Technical & Product Decision Log — genericMed

> **Purpose:** Document every important technical and product decision so that any AI coding assistant (or human developer) can understand *why* the codebase looks the way it does.
>
> **Format:** One entry per decision, newest first. Never delete past entries — only append or mark as `SUPERSEDED` with a link to the replacement decision.

---

## Decision Template

<!--
Copy this block and fill it in for each new decision.

## DEC-XXXX — Title

| Field                | Detail |
|----------------------|--------|
| **Date**             | YYYY-MM-DD |
| **Status**           | `ACCEPTED` · `SUPERSEDED` · `DEPRECATED` |
| **Deciders**         | Names / Roles |

### Context / Problem
_What situation prompted this decision?_

### Decision
_What was decided?_

### Reasoning
_Why this choice over the alternatives?_

### Alternatives Considered
| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|

### Impact on Project
- Architecture:
- Performance:
- Developer Experience:
- User Experience:
-->

---

## DEC-0001 — Use React + Vite + TypeScript as the Frontend Stack

| Field                | Detail |
|----------------------|--------|
| **Date**             | 2025-09-14 (estimated from first API key creation) |
| **Status**           | `ACCEPTED` |
| **Deciders**         | Founding team |

### Context / Problem
The project needed a fast, modern SPA framework for a multi-view healthcare SaaS platform with complex state (cart, auth, multi-role navigation).

### Decision
Use **React 19** with **Vite 6** as the build tool and **TypeScript 5.8** for type safety.

### Reasoning
- React 19 provides the latest concurrent rendering and hook patterns.
- Vite offers near-instant HMR and fast cold starts (critical for AI Studio development flow where HMR can be toggled).
- TypeScript catches shape mismatches across deeply-nested pharmacy/medicine data at compile time.

### Alternatives Considered
| Alternative      | Pros                          | Cons                                    | Why Rejected                         |
|------------------|-------------------------------|-----------------------------------------|--------------------------------------|
| Next.js          | SSR, routing, API routes      | Overhead for a single SPA, opinionated  | No SSR requirement at this stage     |
| Plain JavaScript | No build step                 | No type safety for complex data models  | Too risky for healthcare data shapes |
| Angular          | Full framework, DI            | Heavier bundle, steeper learning curve  | Team familiarity with React          |

### Impact on Project
- **Architecture:** Single-page app with client-side view switching via state (no router yet).
- **Performance:** Vite enables sub-second HMR; production builds are tree-shaken.
- **Developer Experience:** Strong IDE autocomplete across all 10+ TypeScript interfaces.

---

## DEC-0002 — Tailwind CSS v4 with Material 3 Inspired Token System

| Field                | Detail |
|----------------------|--------|
| **Date**             | 2025-09-14 |
| **Status**           | `ACCEPTED` |
| **Deciders**         | Founding team |

### Context / Problem
The UI needs to feel premium and healthcare-trustworthy with a consistent design system across 9 component files.

### Decision
Use **Tailwind CSS v4** (via `@tailwindcss/vite`) with a custom `@theme` block defining a Material Design 3-inspired color token system in `index.css`. Typography uses `Inter` (body) and `Plus Jakarta Sans` (headlines).

### Reasoning
- Tailwind v4 eliminates `tailwind.config.js` — tokens live directly in CSS via `@theme`.
- Material 3 tokens (primary, secondary, tertiary, surface, error) provide accessible contrast ratios out of the box.
- Custom utility classes (`.font-display-lg`, `.font-body-md`, etc.) ensure pixel-perfect typography consistency.

### Alternatives Considered
| Alternative         | Pros                              | Cons                             | Why Rejected                        |
|---------------------|-----------------------------------|----------------------------------|-------------------------------------|
| Vanilla CSS         | Full control                      | Verbose, no utility-first speed  | Slower development velocity         |
| Chakra UI / MUI     | Pre-built components              | Bundle size, style lock-in       | Need full design control for pharma |
| Tailwind v3         | Stable, well-documented           | Config-file based, no `@theme`   | v4 is cleaner with CSS-native tokens|

### Impact on Project
- **Architecture:** All design tokens centralized in [`index.css`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/index.css).
- **UI Consistency:** Every component references the same token palette — no ad-hoc hex colors.

---

## DEC-0003 — Client-Side State Management (No Router, No Redux)

| Field                | Detail |
|----------------------|--------|
| **Date**             | 2025-09-14 |
| **Status**           | `ACCEPTED` |
| **Deciders**         | Founding team |

### Context / Problem
The app has 8 distinct views (`AppView` union type) and shared state (cart, user profile). A state management strategy was needed.

### Decision
Use **React `useState` in `App.tsx`** as the single source of truth, passing state and handlers as props. View switching is controlled by an `AppView` discriminated union — no client-side router.

### Reasoning
- The app is currently a prototype/MVP — adding Redux or Zustand adds indirection without proportional benefit.
- The `AppView` union type (`'customer-search' | 'partner-portal' | ...`) provides compile-time exhaustiveness checks.
- Prop-drilling is manageable with only 9 leaf components.

### Alternatives Considered
| Alternative           | Pros                          | Cons                                      | Why Rejected                              |
|-----------------------|-------------------------------|-------------------------------------------|-------------------------------------------|
| React Router          | URL-based nav, back button    | Adds dependency, route param boilerplate  | Deferred — not needed for demo/prototype  |
| Zustand / Redux       | Global state, devtools        | Over-engineering at current scale         | Revisit when state exceeds 5 slices       |
| React Context         | No prop drilling              | Re-renders, provider nesting complexity   | useState is simpler at current scale      |

### Impact on Project
- **Architecture:** All navigation logic lives in [`App.tsx`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/App.tsx).
- **Limitation:** No browser back-button support or deep-link URLs yet.

---

## DEC-0004 — Mock Data Layer Instead of Backend API

| Field                | Detail |
|----------------------|--------|
| **Date**             | 2025-09-14 |
| **Status**           | `ACCEPTED` |
| **Deciders**         | Founding team |

### Context / Problem
The platform needs realistic medicine, pharmacy, order, tenant, and audit data. A backend is not yet built.

### Decision
Use a single [`mockData.ts`](file:///c:/Users/Manjiri%20Tuplondhe/Downloads/genericMed/src/data/mockData.ts) file exporting typed arrays for all entity types. All components import directly from this file.

### Reasoning
- Enables full UI development without backend dependencies.
- Typed mock data matches the production TypeScript interfaces exactly — swapping to API calls later only requires changing the import source, not the data shape.
- Realistic data (NDC codes, NPI numbers, SLA targets) allows meaningful demo walkthroughs.

### Alternatives Considered
| Alternative            | Pros                          | Cons                                  | Why Rejected                      |
|------------------------|-------------------------------|---------------------------------------|-----------------------------------|
| JSON files + fetch     | Simulates async behavior      | Extra async boilerplate               | Premature for prototype phase     |
| MSW (Mock Service Worker) | Full API mocking           | Setup overhead                        | Revisit when real API is designed |
| Hardcoded in components | Simplest                    | Not reusable, no type guarantee       | Too messy for 9 components        |

### Impact on Project
- **Architecture:** Data layer is a single file with 8 exported constants.
- **Migration Path:** Replace imports with `fetch()` / React Query when backend is ready.

---

## DEC-0005 — Multi-Role Authentication with Role-Based View Access

| Field                | Detail |
|----------------------|--------|
| **Date**             | 2025-09-14 |
| **Status**           | `ACCEPTED` |
| **Deciders**         | Founding team |

### Context / Problem
The platform serves four distinct user roles: `patient`, `pharmacist`, `developer`, and `superadmin`. Each role accesses different views.

### Decision
Implement a `UserProfile` interface with a `role` field discriminating four roles. The `AuthScreen` component handles login/logout and routes users to role-appropriate views. Navigation visibility is role-gated in `NavigationHeader`.

### Reasoning
- Healthcare platforms require strict role separation (HIPAA compliance).
- A single `role` field on `UserProfile` is simple to check and extend.
- The auth screen supports switching between demo profiles for each role.

### Alternatives Considered
| Alternative               | Pros                      | Cons                               | Why Rejected                       |
|---------------------------|---------------------------|------------------------------------|------------------------------------|
| Firebase Auth             | Production-ready auth     | External dependency, setup time    | Deferred to post-prototype         |
| JWT-based custom auth     | Industry standard         | Needs backend                      | No backend yet                     |
| No auth (public views)    | Simplest                  | Can't demo role-based access       | Defeats the multi-tenant narrative |

### Impact on Project
- **Architecture:** Auth state lives in `App.tsx` as `currentUser: UserProfile | null`.
- **Security:** Currently client-side only — **must be replaced with server-side auth before production**.

---

## DEC-0006 — Gemini AI Integration via Server-Side API

| Field                | Detail |
|----------------------|--------|
| **Date**             | 2025-09-14 |
| **Status**           | `ACCEPTED` |
| **Deciders**         | Founding team |

### Context / Problem
The platform needs AI-powered features (drug equivalency analysis, smart search, etc.). An LLM integration was needed.

### Decision
Use **Google Gemini API** (`@google/genai` SDK) with server-side calls via an Express backend. The API key is stored in environment variables (`GEMINI_API_KEY`).

### Reasoning
- Gemini provides strong medical/scientific knowledge grounding.
- Server-side API calls keep the API key secure (never exposed to browser).
- `@google/genai` SDK provides typed, idiomatic JavaScript/TypeScript bindings.

### Alternatives Considered
| Alternative         | Pros                       | Cons                            | Why Rejected                 |
|---------------------|----------------------------|---------------------------------|------------------------------|
| OpenAI GPT-4        | Widely adopted             | Higher cost, less GCP-native    | Gemini is native to stack    |
| Client-side AI      | No server needed           | API key exposure, CORS issues   | Security concern             |
| No AI features      | Simpler architecture       | Missing key differentiator      | AI is core to product value  |

### Impact on Project
- **Architecture:** Express server proxies AI requests; frontend calls the Express endpoint.
- **Environment:** Requires `GEMINI_API_KEY` and `APP_URL` environment variables.

---

## DEC-0007 — Express REST API with Multi-Tenant In-Memory DataStore, JWT Auth & Server-Side Gemini AI

| Field                | Detail |
|----------------------|--------|
| **Date**             | 2026-09-09 |
| **Status**           | `ACCEPTED` |
| **Deciders**         | Founding team |

### Context / Problem
Phase 0 relied exclusively on client-side mock data. A production-grade backend was needed to provide live REST endpoints, tenant-isolated queries, cryptographically secure JWT authentication, and server-side Gemini AI orchestration.

### Decision
Build an **Express.js API server** (in `server/`) with a type-safe `DataStore` repository, JWT authentication middleware, multi-tenant isolation (`x-tenant-id`), rate-limiting, and server-side `@google/genai` integration for clinical drug interaction checks and natural language search.

### Reasoning
- Express offers maximum flexibility, low latency (<50ms for standard cached queries), and seamless TypeScript execution with `tsx`.
- Centralized `DataStore` supports all 10 TypeScript interfaces from `types.ts` with tenant isolation and automated SEC-18 audit log hashing.
- Vite dev server proxies `/api` requests to Express on port 5000 with zero CORS friction in development.

### Alternatives Considered
| Alternative               | Pros                           | Cons                                  | Why Rejected                           |
|---------------------------|--------------------------------|---------------------------------------|----------------------------------------|
| Next.js API Routes        | Fullstack monolithic bundling  | Heavy migration from existing Vite SPA| Too invasive to existing build pipeline|
| External NestJS Framework | Enterprise DI architecture     | Excessive boilerplate for Phase 1 MVP | Express is lighter and faster to iterate|
| Direct Client Firebase    | Serverless data synchronization| Exposes API key & lacks custom HIPAA RLS | Healthcare compliance requires server isolation |

### Impact on Project
- **Architecture:** Complete separation of concerns: `server/` handles data, auth, audit, and AI; `src/services/api.ts` provides typed frontend data access.
- **Security:** Passwords hashed with bcrypt, API keys isolated from browser, JWT token expiry enforced.

---

> **📝 How to add a new decision:**
> 1. Copy the template at the top of this file.
> 2. Assign the next `DEC-XXXX` number.
> 3. Fill in all fields — especially **Alternatives Considered**.
> 4. Commit with message: `docs: add DEC-XXXX — <title>`.
