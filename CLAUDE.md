# CLAUDE.md

## Project Overview

Gold Cargo Smart is a freight forwarding quotation SPA with an authenticated admin dashboard. Built as a pnpm monorepo with a Vue 3 frontend and Node.js/Express backend.

**What it does:**
- Public multi-step quote form for shipping requests (LCL/FCL cargo)
- Admin dashboard for quote history, rate management, and income tracking
- PDF generation for quote summaries
- Excel import for freight rates by continent

---

## Monorepo Structure

```
gold-cargo-smart/
├── spa/          # Vue 3 frontend (Vite, PrimeVue, Pinia, Tailwind)
├── services/     # Node.js/Express backend API (MongoDB/Mongoose)
├── shared/       # Shared utilities (minimal, mostly placeholder)
└── vercel.json   # Vercel SPA rewrite rules
```

---

## Tech Stack

### Frontend (`spa/`)
- **Vue 3** (Composition API) + **Vite 7**
- **Pinia** — state management (auth, quote form, quote history)
- **Vue Router 5** — with `requiresAuth` meta-based guards
- **PrimeVue 4** — UI components with customized Aura theme
- **Tailwind CSS 4** — utility styling
- **jsPDF + AutoTable** — PDF quote generation
- **XLSX** — Excel rate file imports
- **Chart.js** — dashboard analytics charts
- **FontAwesome** — icons

### Backend (`services/`)
- **Express 5** — REST API
- **Mongoose** — MongoDB ODM
- **JWT** — authentication (2-hour expiry)
- **bcryptjs** — password hashing
- ES Modules (`"type": "module"`)

---

## Commands

From project root:
```bash
pnpm dev          # Run spa (port 5173) and services (port 3000) in parallel
```

From `spa/`:
```bash
pnpm dev          # Vite dev server
pnpm build        # Production build → dist/
pnpm preview      # Preview built app
```

From `services/`:
```bash
pnpm dev          # node --watch (hot reload)
pnpm start        # Production start
```

---

## Key Files

| File | Purpose |
|------|---------|
| `spa/src/main.js` | App entry: Vue, Pinia, PrimeVue, theme config |
| `spa/src/router/index.js` | Routes + auth guards; `/` redirects to `/dashboard` |
| `spa/src/stores/auth.js` | JWT + user stored in localStorage |
| `spa/src/utils/api.js` | `apiFetch()` wrapper — auto-injects `Authorization: Bearer` header; 401 triggers logout |
| `spa/src/utils/quotePdf.js` | PDF generation logic |
| `spa/src/utils/constants.js` | Countries, ports, cargo types |
| `spa/vite.config.js` | Vite config with `@` alias → `src/` |
| `services/src/app.js` | Express setup, MongoDB connection, route mounting |
| `services/src/middlewares/authMiddleware.js` | JWT verification middleware |

---

## Routes

### Frontend Routes
| Path | Auth | Component |
|------|------|-----------|
| `/login` | No | `Login.vue` |
| `/register` | No | `Register.vue` |
| `/request-quote` | No | `NewQuote.vue` (multi-step stepper) |
| `/dashboard` | Yes | `Dashboard.vue` (layout) |
| `/dashboard/overview` | Yes | `DashboardOverview.vue` |
| `/dashboard/history` | Yes | `DashboardHistory.vue` |
| `/dashboard/rates` | Yes | `DashboardRates.vue` |
| `/dashboard/income` | Yes | `DashboardIncome.vue` |

### Backend API
| Endpoint | Auth | Purpose |
|----------|------|---------|
| `POST /api/auth/register` | No | Create user |
| `POST /api/auth/login` | No | Login → JWT |
| `POST /api/quotes` | No | Submit quote |
| `GET /api/quotes` | Yes | List all quotes |
| `GET /api/quotes/count` | No | Global quote count |
| `GET/POST/PUT/DELETE /api/rates` | Yes | Freight rates (by continent) |
| `GET/POST/PUT/DELETE /api/income` | Yes | Income records |
| `GET /api/quote-stats` | Yes | Dashboard stats |

---

## Database Models

- **User** — email, password (bcrypt), role
- **Quote** — customer info, origin/destination ports, cargo type (LCL/FCL), services
- **Rate** — continent, data array (from Excel import)
- **Income** — operational expense records
- **QuoteStat** — aggregated quote statistics

---

## Brand Identity

- **Navy**: `#2C3D69`
- **Gold**: `#FFCF25`
- PrimeVue Aura theme customized with these colors in `spa/src/main.js`

---

## Environment Variables

**`services/.env`** (required):
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
PORT=3000
```

**`spa/.env`** (optional):
```
VITE_API_URL=http://localhost:3000
```

---

## Quote Form Flow (Multi-Step)

1. **CustomerInfo** — name, phone, email, notes
2. **ServiceSelection** — Flete, Aduana, Terrestre checkboxes
3. **ShipmentDetails** — origin/destination ports
4. **LclDetails / FclDetails** — cargo specifics (weight/dimensions or container type)
5. **AdditionalServices** — insurance, origin pickup, destination delivery
6. **QuoteSummary** — review + PDF download + submit

State lives in `spa/src/stores/quote.js`.

---

## Deployment

- **Frontend**: Vercel (`vercel.json` rewrites all paths to `index.html`)
- **Backend**: Node.js host (any)
- **Database**: MongoDB Atlas
