# 📏 Project Rules — genericMed

> **Purpose:** Mandatory rules that every AI coding assistant and human developer **must follow** when working on this project. Violations of these rules should be flagged and corrected immediately.
>
> **Enforcement:** These rules are the **highest priority** context. When in doubt, follow these rules over general best practices.

---

## Table of Contents

- [1. Golden Rules](#1-golden-rules)
- [2. Coding Standards](#2-coding-standards)
- [3. Folder Structure Rules](#3-folder-structure-rules)
- [4. Naming Conventions](#4-naming-conventions)
- [5. UI/UX Consistency Rules](#5-uiux-consistency-rules)
- [6. Git Commit Rules](#6-git-commit-rules)
- [7. Security & Environment Variable Rules](#7-security--environment-variable-rules)
- [8. Dependency Management Rules](#8-dependency-management-rules)
- [9. Testing Rules](#9-testing-rules)
- [10. AI Assistant Behavioral Rules](#10-ai-assistant-behavioral-rules)

---

## 1. Golden Rules

> [!CAUTION]
> These rules are **non-negotiable** and override everything else.

| #  | Rule |
|----|------|
| G1 | **Never break existing functionality** unless the user explicitly requests it. |
| G2 | **Never expose API keys or secrets** in client-side code, git history, or logs. |
| G3 | **Never delete or modify mock data** without explicit user confirmation — it represents carefully crafted demo scenarios. |
| G4 | **Always preserve existing comments and docstrings** unrelated to your changes. |
| G5 | **Always maintain TypeScript strict typing** — no `any` types unless absolutely unavoidable and documented with `// TODO: type properly`. |
| G6 | **All medicine/pharmacy/healthcare data must use realistic NDC, NPI, and DEA formats** even in mock data. |

---

## 2. Coding Standards

### TypeScript

```
✅ DO                                    ❌ DON'T
─────────────────────────────────────    ─────────────────────────────────────
Use explicit interface definitions        Use `any` or `unknown` without reason
Use discriminated unions for state        Use string literals for state checks
Use `const` by default                    Use `let` unless mutation is needed
Export types from `types.ts`              Define types inline in components
Use optional chaining (`?.`)              Use nested null checks
Use template literals                     Use string concatenation
```

### React

- **Functional components only** — no class components.
- **Named exports** for components (e.g., `export function CustomerHome()`).
- **Default export only for `App.tsx`** — the root component.
- Use `useState` for component-local state.
- All event handlers should be prefixed with `handle` (e.g., `handleNavigateToDetail`).
- Use **destructured props** with explicit TypeScript interfaces.
- Keep components under **400 lines** — split into sub-components if exceeding.

### Code Style

- **Indentation:** 2 spaces (enforced by TypeScript config).
- **Semicolons:** Required.
- **Quotes:** Single quotes for JavaScript/TypeScript strings; double quotes for JSX attributes.
- **Trailing commas:** Use in multiline arrays, objects, and parameter lists.
- **Max line length:** 120 characters (soft limit).
- **Imports order:**
  1. React imports
  2. Third-party library imports
  3. Local component imports
  4. Local data/type imports
  5. Local utility imports

---

## 3. Folder Structure Rules

```
genericMed/
├── public/                    # Static assets only (images, favicons)
│   └── assets/                # Organized by type (icons/, images/)
├── src/
│   ├── components/            # All React components (one per file)
│   ├── data/                  # Mock data and data constants
│   ├── types.ts               # ALL TypeScript interfaces/types (single source)
│   ├── index.css              # Global styles + Tailwind @theme tokens
│   ├── main.tsx               # React DOM entry point (DO NOT MODIFY)
│   └── App.tsx                # Root component, state management, view routing
├── .env.example               # Environment variable template
├── index.html                 # HTML shell with meta tags and fonts
├── package.json               # Dependencies and scripts
├── vite.config.ts             # Vite + Tailwind + React plugin config
├── tsconfig.json              # TypeScript compiler options
├── decisions.md               # Technical decision log
├── rules.md                   # This file — project rules
├── memory.md                  # Long-term project memory
├── changelog.md               # Version history
└── phases.md                  # Phased development roadmap
```

### Structure Rules

| #  | Rule |
|----|------|
| S1 | **One component per file.** Component file name must match the exported component name in PascalCase (e.g., `CustomerHome.tsx` → `export function CustomerHome`). |
| S2 | **All TypeScript interfaces go in `src/types.ts`.** Never define interfaces inside component files. |
| S3 | **All mock/seed data goes in `src/data/`.** Never hardcode data arrays inside components. |
| S4 | **No nested component folders** (flat structure inside `src/components/`). If the project grows beyond ~15 components, introduce feature folders (e.g., `components/customer/`, `components/admin/`). |
| S5 | **Static assets go in `public/assets/`.** Never put images in `src/`. |
| S6 | **Global styles go in `src/index.css`.** Component-scoped styles use Tailwind utility classes inline. |
| S7 | **Do not create new config files** (e.g., `.prettierrc`, `.eslintrc`) without explicit user approval. |

---

## 4. Naming Conventions

| Element            | Convention            | Example                               |
|--------------------|-----------------------|---------------------------------------|
| **Components**     | PascalCase            | `CustomerHome`, `DrugEquivalency`     |
| **Component files**| PascalCase `.tsx`     | `CustomerHome.tsx`                    |
| **Interfaces**     | PascalCase            | `Medicine`, `PharmacyOffer`           |
| **Type aliases**   | PascalCase            | `AppView`                             |
| **Variables**      | camelCase             | `cartItems`, `selectedMedicineId`     |
| **Constants**      | UPPER_SNAKE_CASE      | `MEDICINES_DATA`, `INITIAL_CART_ITEMS`|
| **Event handlers** | `handle` + Action     | `handleNavigateToDetail`              |
| **Props callbacks**| `on` + Action         | `onNavigateToDetail`, `onAddToCart`   |
| **CSS classes**    | kebab-case (Tailwind) | `font-headline-lg`, `surface-container` |
| **IDs (HTML)**     | kebab-case            | `root`, `search-input`                |
| **Files (data)**   | camelCase `.ts`       | `mockData.ts`                         |
| **Env vars**       | UPPER_SNAKE_CASE      | `GEMINI_API_KEY`, `APP_URL`           |
| **Git branches**   | `type/description`    | `feat/cart-checkout`, `fix/auth-flow` |

---

## 5. UI/UX Consistency Rules

### Design Tokens — Always Use These

| Token Category    | Where Defined                | Usage Rule                                     |
|-------------------|------------------------------|-------------------------------------------------|
| **Colors**        | `@theme` block in `index.css`| **Never use raw hex colors.** Always reference tokens like `primary`, `surface`, `error`. |
| **Typography**    | Utility classes in `index.css` | Use `.font-display-lg`, `.font-headline-md`, `.font-body-sm`, etc. — never set `font-size` manually. |
| **Spacing**       | Tailwind defaults            | Use Tailwind spacing scale (`p-4`, `gap-3`, `mt-6`). |
| **Border radius** | Tailwind defaults            | Use `rounded-xl`, `rounded-2xl`, `rounded-full` consistently. |

### Component Styling Rules

| #  | Rule |
|----|------|
| U1 | **Cards** use `bg-white rounded-2xl border border-outline-variant/30 shadow-sm`. |
| U2 | **Primary buttons** use `bg-primary text-on-primary rounded-xl font-label-md` with hover states. |
| U3 | **Badge/chips** use `font-badge-micro uppercase tracking-wider`. |
| U4 | **Icons** use Material Symbols Outlined (`<span className="material-symbols-outlined">`). |
| U5 | **Animations** use the `motion` library (Framer Motion). Keep durations under 400ms. Prefer `spring` type for interactive elements. |
| U6 | **Background color** is always `bg-[#faf8ff]` (surface) for the app shell. |
| U7 | **Scrollable containers** use `.no-scrollbar` or `.scrollbar-none` class for hidden scrollbars. |
| U8 | **Monospaced data** (NDC codes, IDs, hashes) use `.font-data-mono`. |
| U9 | **Headlines/headings** always use `Plus Jakarta Sans` (applied via `.font-headline` or heading tags). |
| U10 | **Body text** always uses `Inter` (applied globally via `body` selector). |

### Responsive Design

- Design **mobile-first**, then scale up.
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`.
- All views must be usable at `320px` width minimum.

---

## 6. Git Commit Rules

### Commit Message Format

```
<type>(<scope>): <short description>

<optional body>

<optional footer>
```

### Types

| Type       | When to Use                                        |
|------------|----------------------------------------------------|
| `feat`     | New feature or component                           |
| `fix`      | Bug fix                                            |
| `refactor` | Code restructuring (no behavior change)            |
| `style`    | CSS/UI changes only                                |
| `docs`     | Documentation (decisions.md, rules.md, etc.)       |
| `chore`    | Build config, dependency updates                   |
| `test`     | Adding or modifying tests                          |
| `perf`     | Performance improvements                           |

### Scopes

| Scope       | Files Affected                              |
|-------------|---------------------------------------------|
| `auth`      | `AuthScreen.tsx`, auth logic                |
| `cart`      | `CartRevalidation.tsx`, cart state           |
| `customer`  | `CustomerHome.tsx`, `DrugEquivalency.tsx`   |
| `partner`   | `PartnerPortal.tsx`                         |
| `admin`     | `SuperAdminSuite.tsx`                       |
| `dev`       | `DevConsole.tsx`                            |
| `nav`       | `NavigationHeader.tsx`                      |
| `data`      | `mockData.ts`, `types.ts`                  |
| `config`    | `vite.config.ts`, `tsconfig.json`, etc.    |
| `ai`        | Gemini API integration                      |

### Examples

```
feat(cart): add real-time price revalidation on quantity change
fix(auth): prevent blank screen when user cancels login
docs: add DEC-0007 — decision to adopt React Router
refactor(data): split mockData.ts into per-entity files
```

### Rules

- **One logical change per commit.** Don't mix `feat` and `fix`.
- **Never commit `.env` files** — only `.env.example`.
- **Always include the scope** for code changes.
- **Maximum 72 characters** for the first line.

---

## 7. Security & Environment Variable Rules

### Environment Variables

| Variable         | Required | Where Used             | Description                               |
|------------------|----------|------------------------|-------------------------------------------|
| `GEMINI_API_KEY` | Yes      | Server-side (Express)  | Google Gemini API authentication key      |
| `APP_URL`        | Yes      | Server-side            | Deployed URL for self-referential links   |
| `DISABLE_HMR`   | No       | `vite.config.ts`       | Set to `true` in AI Studio to disable HMR |

### Security Rules

| #  | Rule |
|----|------|
| E1 | **Never hardcode secrets** in source code, even in comments or examples. |
| E2 | **`.env` files are gitignored.** Only `.env.example` is committed (with placeholder values). |
| E3 | **All Gemini API calls must be server-side** (via Express proxy). Never call the Gemini API from browser-side React code. |
| E4 | **Patient/healthcare data in mock data is fictional.** Never use real patient names, addresses, or NPI numbers. |
| E5 | **Log sanitization:** Never log full API keys, patient data, or NPI numbers. Use masked versions (e.g., `gmed_live_89f2****4a91`). |
| E6 | **When adding new env vars:** Always update `.env.example` with a placeholder and add a comment explaining the variable. |

---

## 8. Dependency Management Rules

| #  | Rule |
|----|------|
| D1 | **Check `package.json` before adding any new dependency** — the functionality may already exist. |
| D2 | **Prefer lightweight, focused packages** over monolithic ones. |
| D3 | **Pin major versions** in `package.json` (use `^` for minor/patch). |
| D4 | **Never install Tailwind utility plugins** — Tailwind v4 handles everything via `@theme`. |
| D5 | **Animation library is `motion`** (Framer Motion v12+). Don't add `react-spring`, `gsap`, or others without explicit approval. |
| D6 | **Icon library is `lucide-react`** + Material Symbols Outlined. Don't add `react-icons`, `heroicons`, etc. without explicit approval. |
| D7 | **Run `npm run lint` (tsc --noEmit)** after any change to verify type safety. |

---

## 9. Testing Rules

| #  | Rule |
|----|------|
| T1 | **No test framework is configured yet.** When adding tests, use `vitest` (Vite-native) with `@testing-library/react`. |
| T2 | **Test files** go alongside components: `ComponentName.test.tsx`. |
| T3 | **Every new feature should include at least one test** for the happy path. |
| T4 | **Mock data tests:** Verify that all mock data conforms to TypeScript interfaces (compile-time check is sufficient for now). |

---

## 10. AI Assistant Behavioral Rules

> [!IMPORTANT]
> These rules govern how AI coding assistants should interact with this codebase.

| #   | Rule |
|-----|------|
| A1  | **Read `memory.md` first** to understand current project state before making changes. |
| A2  | **Read `decisions.md`** before proposing architectural changes — the decision may already be documented. |
| A3  | **Update `changelog.md`** after every significant change. |
| A4  | **Update `memory.md`** when completing a feature, fixing a bug, or adding an API endpoint. |
| A5  | **Add a new `decisions.md` entry** for any architectural or tech-stack decision. |
| A6  | **Never assume the backend exists.** Currently, all data is mocked client-side. Ask before creating backend files. |
| A7  | **Preserve the design system.** Use existing color tokens and typography classes — don't introduce new visual styles without updating `index.css`. |
| A8  | **When modifying types, update `types.ts` first**, then update all consumers. Never silently ignore type errors. |
| A9  | **When adding a new view**, add it to the `AppView` union type, then add navigation in `NavigationHeader.tsx` and routing in `App.tsx`. |
| A10 | **Ask before deleting code.** If code looks unused, confirm with the user before removing it. |
| A11 | **Consult `phases.md`** before proposing new features — check which phase it belongs to and whether prerequisites are met. |

---

> **📝 How to update rules:**
> 1. Add new rules with the next available number in the appropriate section.
> 2. Never remove rules — mark them as `DEPRECATED: <reason>` if no longer applicable.
> 3. Commit with message: `docs(rules): add rule <ID> — <description>`.
