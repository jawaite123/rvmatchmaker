# RV Matchmaker

Monorepo: React + Vite + Tailwind v4 (client/) and Express + Prisma + SQLite (server/).

## Commands

```bash
npm run dev          # start both (client :5173, server :3001)
npm run dev:client   # client only
npm run dev:server   # server only
npm run seed         # reseed 20 RVs + 15 features
```

In `server/`: `npx prisma db push` after schema changes.

## Key Paths

- `client/src/lib/api.ts` — all types + fetch wrappers + RV_TYPES/FLOORPLAN_TYPES constants
- `client/src/pages/` — Home, Matchmaker, Results, RVDetail, Submit, Admin
- `client/src/components/` — StepNonNegotiables, StepFeatureRanking (dnd-kit), StepFloorplan, RVCard
- `server/src/lib/matcher.ts` — scoring algorithm
- `server/src/routes/` — rvs, match, submit, admin, features
- `server/prisma/schema.prisma` — RV, Feature, RVFeature models
- `server/prisma/seed.ts` — seed data

## Conventions

- Tailwind v4: `@import "tailwindcss"` in CSS, `@tailwindcss/vite` plugin — no config file
- Use `import { type X }` for type-only imports (`verbatimModuleSyntax` is on)
- RV status stored as strings: `PENDING` | `APPROVED` | `REJECTED`
- Client proxies `/api` → `http://localhost:3001` via vite.config.ts
- No auth on `/admin`
