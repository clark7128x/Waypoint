# Waypoint

A trip-planning agent that makes trade-offs visible: drag a budget slider and watch the itinerary actually reshuffle, instead of staring at a spinner and getting a brand-new list with no explanation of what changed.

Built as a full-stack portfolio project, structured as five independently-shippable phases rather than one big bang release.

## Why

Most AI travel-planner demos are a single prompt that outputs a wall of text. Waypoint is built around two decisions a demo usually skips:

- **Budget negotiation is a visual feature, not a re-generate button.** Moving the budget control is meant to animate the plan into its new shape and show exactly what got swapped or cut.
- **Every recommendation shows its reasoning, inline.** Not a generic "AI recommends this" badge — a one-line sourced justification next to each hotel or activity.

## Status

This repo follows the phased plan in [`PHASES.md`](./PHASES.md). Current state:

- [x] **Phase 0 — Skeleton:** Next.js trip form, Express REST API, Postgres via Prisma, Docker Compose. `PATCH /api/trips/:id/budget` already has a test asserting the `swapped_items`/`removed_items` contract the real agent will fill in later. Deployable and demoable on its own.
- [ ] **Phase 1 — Real recommendations:** one real (or realistically mocked) flights/hotels tool call, RAG-sourced justifications
- [ ] **Phase 2 — Agentic:** LangGraph multi-step agent, session memory, the live budget-reflow UI
- [ ] **Phase 3 — Infra:** queued search tasks, cost/latency observability, containers
- [ ] **Phase 4 — Security & polish:** audited SSRF allowlist on the tool-calling path, multi-agent side-flow

See [`PRODUCT.md`](./PRODUCT.md), [`ARCHITECTURE.md`](./ARCHITECTURE.md), and [`DESIGN.md`](./DESIGN.md) for the full spec each phase is being built against.

## Planned stack

| Layer | Tech |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| API | Node.js, Express |
| AI service | Python, LangChain, LangGraph |
| Data | PostgreSQL (Prisma), Redis, pgvector |
| Infra | RabbitMQ, S3, Docker, Prometheus/Grafana |

## Running it locally

```bash
docker compose up -d          # Postgres

cd apps/api
npm install
npm run db:generate && npm run db:push
npm run dev                   # http://localhost:3001

cd ../web
npm install
npm run dev                   # http://localhost:3000
```

## Structure

```
apps/
  web/    Next.js frontend
  api/    Express API + Prisma
```