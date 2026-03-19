# stream.rodion.pro - Phase 1+2 Implementation Plan

## Context

Rodion (Kick channel `wizardjiocb`) needs a personal streaming hub at `stream.rodion.pro`. The site must catch attention, convert visitors to active Kick chatters, and give Rodion a fast admin panel for publishing stream context. This plan covers Phase 1 (Core Shell) + Phase 2 (Backend) with mock data, without live Kick API integration.

## Architecture

```
Production:
  Nginx (443) -> Express (3012) -> /api/*  (JSON API)
                                -> /*      (Vite-built SPA)
                                -> PostgreSQL

Development:
  Vite (:5173) --proxy /api/--> Express (:3012) ---> PostgreSQL
  Single `npm run dev` via concurrently
```

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui + React Router v7 + TanStack Query
- **Backend**: Express + TypeScript + Drizzle ORM + PostgreSQL
- **Auth**: JWT in httpOnly cookie, single admin password (bcrypt hash in .env)
- **Dev**: Vite proxy to Express, `concurrently` runs both, `tsx watch` for server

## Implementation Steps

### Step 1: Project Bootstrap

Create root config files:

| File | Purpose |
|------|---------|
| `package.json` | All deps, scripts (`dev`, `build`, `start`, `db:push`, `db:seed`) |
| `tsconfig.json` + `tsconfig.frontend.json` + `tsconfig.server.json` | TS configs with path aliases |
| `vite.config.ts` | React plugin, proxy to Express, aliases, build to `dist/frontend` |
| `tailwind.config.ts` + `postcss.config.js` | Dark/cyber theme, custom colors |
| `drizzle.config.ts` | Schema path, PG connection |
| `.env.example` | DATABASE_URL, PORT, ADMIN_PASSWORD_HASH, JWT_SECRET, KICK_* stubs |

Key scripts:
- `dev`: `concurrently "vite" "tsx watch src/server/index.ts"`
- `build`: `vite build && tsc -p tsconfig.server.json`
- `start`: `node dist/server/index.js`
- `db:push`: `drizzle-kit push`
- `db:seed`: `tsx src/server/db/seed.ts`

### Step 2: Shared Types

| File | Purpose |
|------|---------|
| `src/shared/types.ts` | SiteState, Game, Format, FeaturedClip, Reward, StatusMode interfaces |
| `src/shared/constants.ts` | StatusMode enum, API routes, Kick channel slug |

### Step 3: Database Schema + Seed

| File | Purpose |
|------|---------|
| `src/server/env.ts` | Typed env validation with zod |
| `src/server/db/connection.ts` | Drizzle + pg pool |
| `src/server/db/schema.ts` | 7 tables: site_settings, games, formats, featured_clips, reward_cache, stream_sessions, admin_sessions |
| `src/server/db/seed.ts` | Idempotent seed: Mass Effect game, 4 formats, 10 rewards, site_settings, 8 prediction examples |

Tables (from SDD section 13.3):
- `site_settings` - singleton: status_mode, hook_title/description, current_game_slug, CTA texts
- `games` - slug, title, descriptions, hero_copy, reward_examples (jsonb), prediction_examples (jsonb)
- `formats` - slug, title, description, participation_rules
- `featured_clips` - url, title, game_slug, thumbnail_url, tags (jsonb), sort_order
- `reward_cache` - title, description, cost, is_enabled, is_paused, note_for_site
- `stream_sessions` - title, category, started_at, is_live
- `admin_sessions` - token_hash, expires_at, is_revoked

### Step 4: Server Routes + Middleware

| File | Purpose |
|------|---------|
| `src/server/middleware/auth.ts` | `requireAdmin`: JWT from cookie validation |
| `src/server/middleware/error-handler.ts` | Structured JSON error responses |
| `src/server/middleware/rate-limit.ts` | 60 req/min public, 5 req/min login |
| `src/server/routes/public.ts` | GET /api/public/state, /rewards, /clips, /games/:slug |
| `src/server/routes/admin.ts` | POST /api/admin/login, POST /state, CRUD /clips |
| `src/server/routes/webhooks.ts` | Stub for future Kick webhooks |
| `src/server/integrations/kick/client.ts` | Stub Kick API client |
| `src/server/integrations/kick/types.ts` | Kick API types |
| `src/server/app.ts` | Express app factory |
| `src/server/index.ts` | Server entry: env, db, middleware, routes, static serving, listen on PORT |

### Step 5: Frontend Shell + Theme

| File | Purpose |
|------|---------|
| `src/frontend/index.html` | HTML with meta/OG tags, Inter + JetBrains Mono fonts |
| `src/frontend/main.tsx` | React entry, QueryClientProvider, RouterProvider |
| `src/frontend/styles/globals.css` | Tailwind directives, CSS variables for dark/cyber theme |
| `src/frontend/lib/utils.ts` | cn() helper, date formatters |
| `src/frontend/lib/api.ts` | Typed fetch wrapper with cookie auth |
| `src/frontend/lib/constants.ts` | Kick URLs, polling intervals |
| `src/frontend/components/ui/*.tsx` | shadcn/ui components (Button, Card, Badge, Dialog, Input, etc.) |

Color system:
- Background: `#0a0a0f`, Card: `#0f0f16`
- Primary (neon green): `#39ff14` at 70% intensity
- Accent (purple): `#8b5cf6`
- Status: LIVE=green, OFFLINE=gray, POSSIBLE=amber, SURPRISE=purple

### Step 6: Layout + Navigation

| File | Purpose |
|------|---------|
| `src/frontend/App.tsx` | Root layout with Navbar, Outlet, Footer |
| `src/frontend/router.tsx` | All routes with lazy loading |
| `src/frontend/components/layout/Navbar.tsx` | Logo, status dot, nav links, mobile hamburger |
| `src/frontend/components/layout/Footer.tsx` | Kick link, copyright |
| `src/frontend/components/layout/MobileNav.tsx` | Sheet-based drawer |
| `src/frontend/components/layout/StatusIndicator.tsx` | Pulsing LIVE/OFFLINE badge |

### Step 7: Data Hooks

| File | Purpose |
|------|---------|
| `src/frontend/hooks/useSiteState.ts` | Polls /api/public/state every 30s via TanStack Query |
| `src/frontend/hooks/useRewards.ts` | Fetches /api/public/rewards |
| `src/frontend/hooks/useClips.ts` | Fetches /api/public/clips |
| `src/frontend/hooks/useAdmin.ts` | Admin auth context, login/logout, protected fetch |

### Step 8: Homepage Sections (all content in Russian)

| Component | Purpose |
|-----------|---------|
| `HeroSection.tsx` | Status badge, hook text, CTA buttons, current game |
| `PlayerSection.tsx` | Kick iframe embed (16:9), offline fallback |
| `HowItWorksSection.tsx` | Channel Points / predictions explainer |
| `RewardsBoard.tsx` | Grid of reward cards with cost, status |
| `PredictionsSection.tsx` | Prediction examples |
| `FormatsSection.tsx` | Stream format cards |
| `ClipsSection.tsx` | Featured clips grid with thumbnails |
| `EventFeedSection.tsx` | Placeholder for future live events |
| `AboutSection.tsx` | Rodion / stream identity |
| `RewardCard.tsx`, `ClipCard.tsx`, `FormatCard.tsx` | Reusable card components |

### Step 9: Pages

| Page | Route | Purpose |
|------|-------|---------|
| `HomePage.tsx` | `/` | Assembles all sections, fetches state+rewards+clips |
| `GamePage.tsx` | `/game/:slug` | Mass Effect landing with rewards, predictions, formats |
| `ClipsPage.tsx` | `/clips` | Full clips archive |
| `FormatsPage.tsx` | `/formats` | All stream formats |
| `AboutPage.tsx` | `/about` | About the stream |
| `AdminLoginPage.tsx` | `/admin` | Password login form |
| `AdminDashboardPage.tsx` | `/admin/dashboard` | Tabs: State editor, Clips CRUD, Rewards view |

### Step 10: Admin Panel

Tabs within AdminDashboardPage:
- **State tab**: 4 status buttons (LIVE/OFFLINE/POSSIBLE/SURPRISE), hook title/description inputs, game/format selectors, CTA text, save
- **Clips tab**: Table + add/edit/delete dialog forms
- **Rewards tab**: Read-only cards with editable note_for_site

## Critical Files

- `src/server/db/schema.ts` - All 7 tables, foundation of backend
- `src/shared/types.ts` - Frontend-backend contract
- `src/server/routes/public.ts` - All public data delivery
- `src/frontend/pages/HomePage.tsx` - Main user-facing page
- `vite.config.ts` - Dev proxy, aliases, build config

## Verification Plan

1. `npm run db:push` - schema syncs to PostgreSQL without errors
2. `npm run db:seed` - seed data populates all tables
3. `npm run dev` - Vite + Express start, homepage loads at localhost:5173
4. Homepage shows: hero with status badge, hook text, CTA buttons, player embed, all content sections with seed data
5. `/game/mass-effect-legendary` renders game page with rewards, predictions, formats
6. `/admin` - login with password, dashboard loads
7. Admin can change status mode, hook text, CTA - changes reflect on homepage
8. Admin can add/edit/delete clips
9. `npm run build && npm start` - production build serves correctly on port 3012
10. Mobile responsive: all sections readable, CTAs prominent, player full-width

## Not in Scope (future phases)

- Kick OAuth flow, channel/livestream API polling
- Webhook endpoint with signature validation
- Real-time event feed (SSE/WebSocket)
- PM2 ecosystem config, Nginx vhost config
- Restreamer Docker Compose
- Analytics tracking
- SEO JSON-LD
