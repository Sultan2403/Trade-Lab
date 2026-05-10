# Trade-Lab

Trade-Lab is a full-stack **trading journal + analytics workspace** that helps traders convert raw execution history into actionable feedback.

- Log manual trades quickly.
- Import broker history via CSV.
- Segment performance by account.
- Track analytics and equity trends.
- Generate insight summaries to improve decision quality.

🌐 Live app: https://trade-lab-pro.vercel.app

---

## Table of Contents
- [Why Trade-Lab](#why-trade-lab)
- [Who this is for](#who-this-is-for)
- [Quick start (60 seconds)](#quick-start-60-seconds)
- [Core user journeys](#core-user-journeys)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Monorepo structure](#monorepo-structure)
- [Backend API overview](#backend-api-overview)
- [Data model](#data-model)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Engineering roadmap](#engineering-roadmap)
- [License](#license)

---

## Why Trade-Lab
Most traders have fragmented workflows: spreadsheets, screenshots, notes, and broker exports spread across tools.
Trade-Lab centralizes all of that into one workflow so performance review is fast, consistent, and decision-oriented.

### Outcomes this project targets
- Better discipline via consistent journaling.
- Faster detection of winning/losing patterns.
- Cleaner account-level attribution.
- Better review loops through analytics + insights.

---

## Who this is for
- Retail traders managing one or more accounts.
- Prop traders tracking rule-driven execution quality.
- Developers who want to extend a trading-journal product.

---

## Quick start (60 seconds)

```bash
git clone https://github.com/Sultan2403/Trade-Lab.git
cd Trade-Lab

cd Backend && npm install
cd ../Frontend && npm install
```

Create env files:

- `Backend/.env`
- `Frontend/.env`

Run both apps in separate terminals:

```bash
# Terminal 1
cd Backend
npm run dev

# Terminal 2
cd Frontend
npm run dev
```

Local defaults:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## Core user journeys

### 1) New user onboarding
1. Register/login.
2. Create first account (Live or Demo).
3. Start adding or importing trades.

### 2) Manual journaling flow
1. Open add-trade UI.
2. Submit trade details and optional notes/risk fields.
3. Review position later in history + analytics.

### 3) CSV import flow
1. Upload CSV via import endpoint/UI.
2. Parse and map rows.
3. Persist valid trades and skip invalid/duplicate rows.

### 4) Performance review flow
1. Load account-scoped analytics.
2. View aggregate metrics + equity curve.
3. Read generated insight patterns.

---

## Architecture

Trade-Lab is a two-app monorepo:
- `Frontend/` — React + Vite client.
- `Backend/` — Express + MongoDB API.

### High-level request flow
1. User authenticates via `/auth`.
2. Frontend stores tokens and sends bearer access token on API calls.
3. Backend middleware validates access token.
4. Domain routes use `accountId` scoping for account isolation.
5. Services query and compute analytics/insights from accounts + trades.

### Backend layering
- **Routers**: endpoints + validation bindings.
- **Controllers**: request orchestration and response shaping.
- **Services**: business logic and computation.
- **Models**: MongoDB schema/index definitions.
- **Middleware**: auth, rate limiting, CSV upload/parse, celebrate error handling.

---

## Tech stack

### Frontend
- React 19
- Vite 7
- React Router 7
- Axios
- Tailwind CSS
- MUI + Emotion
- Recharts

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- Celebrate/Joi request validation
- JWT access + refresh token auth
- bcrypt password hashing
- Multer + csv-parser ingestion pipeline
- express-rate-limit

---

## Monorepo structure

```text
Trade-Lab/
├─ Backend/
│  ├─ Controllers/
│  ├─ DB/
│  │  ├─ Connections/
│  │  └─ Models/
│  ├─ Helpers/
│  ├─ Middleware/
│  ├─ Routers/
│  ├─ Schemas/
│  ├─ Services/
│  ├─ Utils/
│  ├─ app.js
│  └─ server.js
├─ Frontend/
│  ├─ src/
│  │  ├─ Apis/
│  │  ├─ Components/
│  │  ├─ Helpers/
│  │  ├─ Hooks/
│  │  └─ Validators/
│  └─ vite.config.js
└─ README.md
```

---

## Backend API overview

Base URL is environment-defined (local backend default: `http://localhost:5000`).

### Public routes
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /`
- `GET /health`

### Protected routes
- `POST /accounts`
- `GET /accounts`
- `GET /accounts/:accountId`
- `POST /trades`
- `GET /trades?accountId=...`
- `POST /trades/csv-import?accountId=...`
- `GET /trades/:id?accountId=...`
- `PATCH /trades/:id?accountId=...`
- `DELETE /trades/:id?accountId=...`
- `GET /analytics?accountId=...`
- `GET /analytics/equity-curve?accountId=...`
- `GET /insights?accountId=...`

Validation is applied with Celebrate/Joi for body/query/params schemas where relevant.

---

## Data model

### User
- `username`, `email`, `password`
- `refreshTokenHash` for refresh-token rotation/verification

### Account
- `userId`
- `name`
- `starting_balance`
- `current_balance`
- `type` (`Live` | `Demo`)

### Trade
- Identity/scope: `accountId`, optional `external_id`
- Position fields: `pair`, `direction`, `entry_price`, `size`
- Risk fields: `stopLoss`, `takeProfit`, `riskPercent`, `riskToReward`
- Lifecycle: `status`, `openedAt`, `closedAt`, `duration`
- Outcome: `pnl`, `outcome`
- Metadata: `metadata.source`, `commission`, `swap`, `chartUrl`, `tags`, `notes`

Notable constraints:
- Unique compound index on `{ accountId, external_id }` for import deduplication.
- Conditional required fields for closed-trade lifecycle data.

---

## Environment variables

### Backend (`Backend/.env`)

```env
PORT=5000
MONGO_DB_URI=<your_mongodb_connection_string>
JWT_ACCESS_SECRET=<strong_access_secret>
JWT_REFRESH_SECRET=<strong_refresh_secret>
```

### Frontend (`Frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## Scripts

### Backend
- `npm run start` — run server with Node.
- `npm run dev` — run server with nodemon.

### Frontend
- `npm run dev` — run Vite dev server.
- `npm run build` — generate production build.
- `npm run preview` — preview production build locally.
- `npm run lint` — run ESLint.

---

## Engineering roadmap

- Add automated tests (unit + integration + API contract).
- Add API docs (OpenAPI/Swagger).
- Add role-based authorization and account-sharing model.
- Add CI pipeline (lint + tests + build checks).
- Add observability (structured logs, error reporting, metrics).

---

## License

Proprietary license. All rights reserved. See `LICENSE.md` for full terms.
