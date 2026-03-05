# DZone Vite

> Digital Zone — campaign-management & lead-orchestration admin dashboard, rebuilt on Vite + React 19.

![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Vite 7](https://img.shields.io/badge/Vite-7-646cff?logo=vite)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Ant Design 6](https://img.shields.io/badge/Ant%20Design-6-0170fe?logo=antdesign)

---

## Tech Stack

| Category | Library | Version |
|---|---|---|
| Framework | React | 19 |
| Build tool | Vite | 7 |
| Language | TypeScript | 5 |
| UI library | Ant Design (antd) | 6 |
| Routing | React Router | 7 |
| State management | Zustand | 5 |
| Server-state / caching | TanStack React Query | 5 |
| HTTP client | Axios | 1.7 |
| Charts | Recharts | 3 |
| Charts (advanced) | amCharts 5 | 5.13 |
| i18n | i18next + react-i18next | 25 / 16 |
| CSS | Sass (SCSS) | 1.74 |
| Error monitoring | Sentry | 10 |
| Form utilities | Immer | 10 |
| Markdown | react-markdown + remark-gfm | 10 / 4 |
| Code highlighting | Prism.js | 1.30 |
| Phone validation | libphonenumber-js | 1.12 |
| Sanitization | DOMPurify | 3 |
| Linting | ESLint 9 (flat config) | 9 |
| Formatting | Prettier | 3 |
| CSS linting | Stylelint | 17 |
| Git hooks | Husky + lint-staged | 9 / 16 |
| React Compiler | babel-plugin-react-compiler | 1.0 |

---

## Architecture Overview

- **Single-page application** — static build served by `serve` in SPA mode
- **Direct API calls** — no BFF; the browser talks to 17 backend micro-services through an API gateway
- **React Compiler** — enabled via `babel-plugin-react-compiler` for automatic memoisation
- **Lazy routes** — every page-level component is loaded with `React.lazy()` for code splitting
- **Vendor chunks** — 7 manual Rollup chunks (`vendor-antd`, `vendor-charts`, `vendor-amcharts`, `vendor-dayjs`, `vendor-i18n`, `vendor-lodash`, `vendor-core`)
- **Path aliases** — `@/lib`, `@/components`, `@/services`, `@/uicomponents`, `@/stores`, `@/config`, `@/app`, `@/contexts`, `@/providers`

---

## Project Structure

```
src/
├── app/                          # Route-level pages (file-system-like layout)
│   ├── (auth-pages)/             # Login, forgot-password
│   ├── (dashboard)/              # All authenticated pages
│   │   ├── analytics/            # Marketer & supplier analytics
│   │   ├── campaign-management/  # Campaigns, line-items, leads
│   │   ├── dashboard/            # Main dashboard
│   │   ├── dz-one-ai-coworker/  # AI coworker chat
│   │   ├── dzent/                # DZent AI assistant
│   │   ├── integrations-hub/     # Integration templates & config
│   │   ├── jobs/                 # Background job monitoring
│   │   ├── lead-validation-settings/
│   │   ├── profile/              # User profile
│   │   ├── ums/                  # User & role management
│   │   ├── users/                # User list
│   │   └── (system-admin)/organizations/
│   ├── set-password/
│   ├── unauthorized/
│   └── i18n.ts                   # i18next initialisation
├── auth/                         # AuthGuard, PermissionGuard, auth stores, auth service
├── components/
│   ├── uicomponents/             # Ant Design wrappers (enforced by ESLint)
│   ├── auth/                     # <CanAccess>, <HasPermission>
│   ├── charts/                   # Recharts wrappers
│   ├── amcharts/                 # amCharts wrappers
│   ├── form/                     # Shared form components
│   ├── layout/                   # Sidebar, header, footer
│   ├── modals/                   # Shared modals
│   ├── table/                    # Table components
│   └── shared/                   # Misc shared components
├── config/                       # Theme configs (black, blue.v1, blue.v2), resources
├── hooks/                        # Shared React hooks
├── layout/                       # AppLayout, AuthLayout
├── lib/                          # Constants, query client, utilities, hooks
├── services/                     # HTTP client, backend request, Sentry, logger, SSE
├── stores/                       # Global Zustand stores (theme, permissions, tenant, unsaved-data)
├── router.tsx                    # Route definitions (createBrowserRouter)
├── app.tsx                       # Root <App /> component
├── main.tsx                      # Entry point (Sentry init → i18n → React render)
├── global.scss                   # Global styles
├── variables.css                 # CSS custom properties
└── variables.scss                # SCSS variables
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 20 (enforced in `engines`)
- **npm** (lock file is `package-lock.json`)

### Install & Run

```bash
# Clone
git clone <repo-url> && cd dzone-vite

# Install dependencies
npm ci

# Create environment file
cp .env.example .env
# Edit .env — at minimum set VITE_API_URL, VITE_APP_ENV, VITE_SECRET_KEY

# Start dev server (port 3001)
npm run dev
```

The dev server proxies `/api/*` requests to `http://localhost:3000`.

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite --port 3001` | Start Vite dev server |
| `build` | `tsc --noEmit && vite build` | Type-check then production build |
| `preview` | `vite preview` | Preview production build locally |
| `start` | `serve -s dist -l 3000` | Serve production build (SPA mode) |
| `lint` | `eslint 'src/**/*.{js,jsx,ts,tsx}'` | Lint source files |
| `lint:css` | `stylelint 'src/**/*.{css,scss}'` | Lint stylesheets |
| `typecheck` | `tsc --noEmit` | TypeScript type-check |
| `format` | `prettier --write ...` | Format all source files |
| `format:check` | `prettier --check ...` | Check formatting (CI) |
| `prepare` | `husky` | Install git hooks |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | Yes | — | Backend API gateway URL (e.g. `https://dzone-dev2.digitalzoneus.com`) |
| `VITE_APP_ENV` | Yes | — | App environment (`development`, `qa`, `uat`, `production`) |
| `VITE_SECRET_KEY` | Yes | — | Encryption key for client-side crypto |
| `VITE_AI_COWORKER_API_URL` | No | `VITE_API_URL` | AI Coworker API host (code appends `/api/coworker`) |
| `VITE_AUTH_SESSION_TIMEOUT` | No | `1` | Auth session timeout in days |
| `VITE_LOGGER_URL` | No | — | Remote logger endpoint URL |
| `VITE_LOG_HTTP_REQUEST_DETAILS` | No | `true` | Log full HTTP request details (`true`/`false`) |
| `VITE_LOG_HTTP_RESPONSE_DETAILS` | No | `true` | Log full HTTP response details (`true`/`false`) |
| `VITE_GA_TRACKING_ID` | No | — | Google Analytics tracking ID |
| `VITE_CLARITY_TRACKING_ID` | No | — | Microsoft Clarity tracking ID |
| `VITE_SENTRY_DSN` | No | — | Sentry DSN — Sentry is disabled if empty |
| `VITE_SENTRY_ENVIRONMENT` | No | Vite `MODE` | Sentry environment tag (falls back to Vite mode) |
| `VITE_SENTRY_TRACES_SAMPLE_RATE` | No | `1.0` | Performance tracing sample rate (`0.0`–`1.0`) |
| `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | No | `0.1` | Session replay sample rate (`0.0`–`1.0`) |
| `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` | No | `1.0` | Replay capture rate when an error occurs (`0.0`–`1.0`) |

---

## Routing

Uses **React Router v7** with `createBrowserRouter`. All authenticated routes are wrapped by `AuthGuard` → `PermissionGuard` → `AppLayout`. Every page component is lazy-loaded.

### Route Table

| Path | Page |
|---|---|
| `/login` | Login |
| `/forgot-password` | Forgot Password |
| `/set-password` | Set Password |
| `/unauthorized` | Unauthorized |
| `/` | Default Redirect (first permitted route) |
| `/dashboard` | Dashboard |
| `/profile` | User Profile |
| `/users` | Users List |
| **Campaign Management** | |
| `/campaign-management/campaigns` | Campaigns List |
| `/campaign-management/campaigns/create` | Create Campaign |
| `/campaign-management/campaigns/:campaignId` | View Campaign |
| `/campaign-management/campaigns/:campaignId/edit` | Edit Campaign |
| `/campaign-management/line-items` | Line Items List |
| `/campaign-management/line-items/create` | Create Line Item |
| `/campaign-management/line-items/:lineItemId` | View Line Item |
| `/campaign-management/line-items/:lineItemId/edit` | Edit Line Item |
| `/campaign-management/line-items/:lineItemId/leads` | Line Item Leads |
| `/campaign-management/line-items/:lineItemId/delivery-logs` | Delivery Logs |
| `/campaign-management/line-items/:lineItemId/batches/:batchId/leads` | Batch Leads |
| `/campaign-management/leads` | All Leads |
| **User Management** | |
| `/ums/users` | UMS Users |
| `/ums/users/create` | Create User |
| `/ums/users/:userId` | View User |
| `/ums/roles` | Roles |
| `/ums/roles/create` | Create Role |
| `/ums/roles/:roleId` | View Role |
| **Organizations** | |
| `/organizations` | Organizations List |
| `/organizations/create` | Create Organization |
| `/organizations/:organizationId` | View Organization |
| **Lead Validation** | |
| `/lead-validation-settings` | Validation Settings |
| `/lead-validation-settings/create` | Create Settings |
| `/lead-validation-settings/line-items/:lineItemId/settings/:id` | Line Item Settings |
| `/lead-validation-settings/organizations/:tenantCode/settings/:id` | Org Settings |
| **Analytics** | |
| `/analytics/marketers` | Marketer Analytics |
| `/analytics/supplier` | Supplier Analytics |
| **Integrations Hub** | |
| `/integrations-hub/integrations` | Integrations |
| `/integrations-hub/integrations/:id` | View Integration |
| `/integrations-hub/templates` | Templates |
| `/integrations-hub/templates/create` | Create Template |
| `/integrations-hub/templates/:templateId/update` | Update Template |
| `/integrations-hub/download-file` | File Download |
| **AI** | |
| `/dzent` | DZent AI |
| `/dzent/actions/:action` | DZent Action |
| `/dz-one-ai-coworker` | AI Coworker |
| **Other** | |
| `/jobs` | Background Jobs |
| `*` | Not Found |

---

## API Layer

### HTTP Stack

```
authenticatedRequest()          ← Feature services call this
  └── backendRequest()          ← Builds URL, attaches Bearer token + X-Request-Id
        └── axiosInstance       ← Single Axios instance with request/response interceptors
```

- **Request interceptor** — logs method, URL, headers, payload (when `VITE_LOG_HTTP_REQUEST_DETAILS !== 'false'`)
- **Response interceptor** — strips raw Axios response to `{ data, headers }`; on error adds a Sentry breadcrumb and rejects with `{ error, statusText, status, data }`
- **Auto-logout** — 401/403 responses clear all auth stores and redirect to `/login`
- **Error notifications** — API error messages are shown via Ant Design notification
- **Streaming** — a separate `streamingAxios` instance (no interceptors) used for SSE connections

### Backend Services

| Service | Base Path |
|---|---|
| Campaign Service | `/api/campaign-service` |
| Reporting Service | `/api/reporting-service` |
| File Service | `/api/file-service` |
| RBAC / Auth Service | `/api/rbac-service` |
| Lead Orchestration Service | `/api/lead-orchestration-service` |
| Campaign Delivery Service | `/api/campaign-delivery-service` |
| Transformation Service | `/api/transformation-service` |
| Recommendation Service | `/api/recommendation-service` |
| Audit Service | `/api/audit-service` |
| Organization Service | `/api/organization-service` |
| AI Copilot Service | `/api/ai-copilot` |
| Platform Service | `/api/platform-service` |
| Common Service | `/api/common-service` |
| Analytics Service | `/api/analytics-service` |
| Job Monitoring Service | `/api/job-monitoring` |
| AI Coworker Service | `/api/coworker` (separate host) |
| Logger Service | `VITE_LOGGER_URL` (external) |

---

## State Management

Uses **Zustand 5** for client state. Stores are split into global (persisted) and feature-local (in-memory).

### Global Stores (persisted)

| Store | Persistence | Contents |
|---|---|---|
| `useAuthStore` | `localStorage` (`auth-storage`) | `isAuthenticated`, `user`, `roles`, `tenantCode`, `tenantType`, `modules` |
| `useTokenStore` | `localStorage` (`token-storage`) | `accessToken`, `apiUrl` |
| `usePermissionsStore` | `localStorage` (`permissions-storage`) | `modules[]`, `accesses: Record<string, boolean>`, `attributes` |
| `useThemeStore` | Cookie (`js-cookie`) | `mode` (light/dark), `uiTheme` |

### Feature Stores (in-memory)

| Store | Feature | Notes |
|---|---|---|
| `useTenantTypeStore` | Tenant types | Fetches and caches tenant type options |
| `useUnsavedDataStore` | Form dirty tracking | Tracks source/target object diffs for unsaved-changes warnings |
| `useCampaignListStore` | Campaign list | Loading state |
| `useLineItemContextStore` | Line item detail | Current line item context |
| `useLeadsStore` | Leads | Leads list, filters, pagination, export state |
| `useLeadsCountStore` | Leads count | Total leads count (immer) |
| `usePacingSummaryStore` | Pacing | Sort, status filter, pagination |
| `useDeliveryLogsStore` | Delivery logs | Date/status filters, pagination (immer) |
| `useDashboardReportStore` | Dashboard | Dashboard report filters |
| `useFilterDashboardStore` | Analytics | Marketer/supplier analytics filter state |
| `useTemplateStore` | Integration templates | Multi-step template creation wizard |
| `useValidationSettingStore` | Lead validation | Validation rules, settings config (immer) |
| `useAiAgentStore` | AI Coworker | Streaming chat, conversations, attachments (immer) |
| `useDzentStore` | DZent AI | Chat state, history, system messages (immer) |

---

## Data Fetching & Caching

Uses **TanStack React Query 5** with a centralized `QueryClient`.

### Default Options

```
staleTime:            2 minutes
gcTime:               10 minutes
refetchOnWindowFocus: false
refetchOnReconnect:   true
retry:                up to 2 retries (skips 400, 401, 403, 422)
mutations:            no retry
```

### Query Key Factory

A hierarchical factory (`src/lib/query/query-keys.ts`) covering 18 domains. Pattern:

```ts
queryKeys.campaigns.all              // ['campaigns']
queryKeys.campaigns.lists()          // ['campaigns', 'list']
queryKeys.campaigns.list(params)     // ['campaigns', 'list', { ...params }]
queryKeys.campaigns.detail(id)       // ['campaigns', 'detail', id]
```

Domains: `campaigns`, `lineItems`, `leads`, `deliverySchedules`, `pacing`, `users`, `roles`, `organizations`, `dashboard`, `validationSettings`, `integrations`, `templates`, `analytics`, `dzent`, `transformHistory`, `fileUpload`, `prefilledLists`, `jobs`, `profile`, and more.

---

## Authentication & Authorization

### Login Flow

1. POST `{ username, password }` → RBAC Service (`/api/rbac-service`)
2. Receive JWT `accessToken` + `modules` (permissions tree)
3. Flatten permissions into `{ "module.access": true }` map
4. Persist to three Zustand stores: `useTokenStore`, `useAuthStore`, `usePermissionsStore`
5. Set Sentry user context

### Route Guards

- **`<AuthGuard>`** — checks `isAuthenticated`; redirects to `/login?to=<path>` if unauthenticated
- **`<PermissionGuard>`** — checks the user's module list against the current route; redirects to `/unauthorized` if not authorized

### Component-level Guards

- **`<CanAccess accessKey="...">`** — renders children only if user has the specified access key
- **`<HasPermission permissions="...">`** — renders children only if user has the specified permissions

### Session Hooks

- `useSession()` — reactive hook returning `{ data, status }` (`'loading'` | `'authenticated'` | `'unauthenticated'`)
- `signOut()` — calls logout endpoint, clears stores, redirects to `/login`

---

## UI Component System

All Ant Design components are re-exported through `src/components/uicomponents/`. ESLint rules **forbid**:

1. **Direct HTML elements** — `div`, `span`, `p`, `button`, `input`, `select`, `textarea`, `a`, `h1`–`h6`, `img`, `table`, `ul`, `li`, `form`, `label` (must use Ant Design / custom wrappers)
2. **Direct `antd` imports** — must import from `@/components/uicomponents`
3. **Direct `@ant-design/icons` imports** — must import from `@/components`

These rules are exempted inside `src/components/**` where the wrappers are defined.

### Key Wrappers

`alert`, `autocomplete`, `avatar`, `badge`, `breadcrumb`, `button`, `collapse`, `divider`, `drawer`, `dropdown`, `form`, `grouped-select`, `icons`, `image`, `layout`, `link`, `menu`, `modal`, `notification`, `pagination`, `popover`, `progress`, `result`, `select`, `simple-pagination`, `spin`, `steps`, `switch`, `table`, `tabs`, `tag`, `text`, `title`, `tooltip`, `upload`

---

## Theming

Three Ant Design theme configs in `src/config/`:

| Theme | Export | Primary Color | Usage |
|---|---|---|---|
| `black.theme.ts` | `blackTheme` | `#323131` | Default dashboard theme (dark sidebar, light body) |
| `blue.v1.theme.ts` | `blueThemeV1` | `#323131` | Auth pages (login, forgot-password) |
| `blue.v2.theme.ts` | `blueThemeV2` | `#235aed` | Alternate blue-accent dashboard |

- Font families: **Roboto** (global), **Poppins** (sidebar menu)
- Theme selection is managed by `useThemeStore` and persisted in a cookie
- Light/dark mode toggle via `mode` property

---

## Internationalization

Uses **i18next** with `i18next-http-backend` (lazy-loads JSON) and `i18next-browser-languagedetector`.

- **Supported languages:** English (`en`), German (`de`)
- **Namespace:** `common` (default)
- **Translation files:** `/public/locales/{en,de}/common.json`
- **Fallback chain:** `en` → `de`

---

## Build & Code Splitting

### Manual Vendor Chunks

| Chunk | Contents |
|---|---|
| `vendor-antd` | `antd`, `@ant-design/*`, `@rc-component/*` |
| `vendor-charts` | `recharts`, `d3-*`, `victory-vendor` |
| `vendor-amcharts` | `@amcharts/amcharts5` (lazy — analytics pages only) |
| `vendor-dayjs` | `dayjs` |
| `vendor-i18n` | `i18next`, `react-i18next` |
| `vendor-lodash` | `lodash` |
| `vendor-core` | React, Zustand, Sentry, Axios, markdown, everything else |

### Build Output

- Output directory: `dist/`
- Source maps: enabled
- Chunk size warning limit: 2000 KB
- Bundle visualiser: `rollup-plugin-visualizer` available as dev dependency

---

## Code Quality

### ESLint 9 (Flat Config)

- TypeScript-aware rules via `typescript-eslint`
- React Compiler rule: `react-compiler/react-compiler: "error"`
- React Hooks rules
- React Refresh validation
- Prettier integration (`eslint-config-prettier`)
- Custom `no-restricted-syntax` + `no-restricted-imports` for uicomponents enforcement

### Prettier

Formats `ts`, `tsx`, `js`, `jsx`, `scss`, `css`, `json`.

### Stylelint

- Config: `stylelint-config-standard-scss` + `stylelint-config-prettier-scss`
- Lints all `.css` and `.scss` files

### Git Hooks (Husky)

| Hook | Runs |
|---|---|
| `pre-commit` | `lint-staged` (Prettier + ESLint on staged `.ts/.tsx`, Prettier + Stylelint on staged `.scss/.css`) + `tsc --noEmit` |
| `pre-push` | `npm run build` (full production build) |

---

## Monitoring

### Sentry

- Initialised in `main.tsx` before React render
- Integrations: `browserTracingIntegration`, `replayIntegration`
- HTTP errors are added as Sentry breadcrumbs in the Axios response interceptor
- User context set on login, cleared on logout
- Disabled when `VITE_SENTRY_DSN` is empty

### Google Analytics

Enabled when `VITE_GA_TRACKING_ID` is set.

### Microsoft Clarity

Enabled when `VITE_CLARITY_TRACKING_ID` is set.

### Remote Logger

- `Logger` class — batches up to 20 entries, flushes every 10 seconds to `VITE_LOGGER_URL`
- Levels: `debug`, `info`, `warn`, `error`
- HTTP request/response details logged via interceptors (configurable via env vars)
- Dev-only console output
- Remaining buffer flushed on `beforeunload`

---

## Docker

Two-stage build:

```dockerfile
# Stage 1 — Build
FROM node:20-alpine
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — Serve
FROM node:20-alpine
RUN npm install -g serve@14
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Production image serves the static SPA on port **3000**.
