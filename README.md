# Career Profile

A profile-centered web application for managing personal career data, work history, education, certifications, professional focus, and skills, with lightweight user administration.

The repository is intentionally a **well-documented starting point** rather than a completed product. Product behavior is specified feature-by-feature under `docs/product/features/`; technical architecture is documented separately under `docs/architecture/` and technical ADRs.

## Product scope

The initial release is planned to support:

- email/password authentication with server-managed sessions;
- user registration and lightweight onboarding;
- single Profile workspace plus Account Profile/Settings;
- work experience with catalog-backed Company → Job Title entry;
- education with Institution → Major / Specialization → Degree Type dependent selectors;
- certifications with Certification Board → Certification / Exam dependent selectors;
- Professional Focus, a flexible set of user-selected focus areas with optional primary focus;
- a large global skills catalog plus user-created custom skills;
- Technical and Foundational skill categories;
- Beginner, Intermediate, and Advanced proficiency levels;
- shared catalog search behavior across profile selectors: exact/prefix/substring/fuzzy ranking, debouncing, keyboard accessibility, and viewer-private custom values;
- multi-source skill provenance from manual entry, experience, education, and certifications;
- a simple admin view for listing and creating users/admins;
- realistic seed catalogs for skills, companies, job titles, institutions, academic programs, certification boards/exams, and focus areas.

Resume upload/profile import and generated-resume flows are documented but deferred from the initial release.

Concrete design artifacts are browsable from [`docs/design/artifacts/index.html`](docs/design/artifacts/index.html). For faster visual QA, [`docs/design/artifacts/all-pages.html`](docs/design/artifacts/all-pages.html) renders every artifact on one page grouped by domain.

Start with:

- [`docs/product/PRD.md`](docs/product/PRD.md)
- [`docs/product/FEATURE_STATUS.md`](docs/product/FEATURE_STATUS.md)
- [`docs/product/PAGE_INVENTORY.md`](docs/product/PAGE_INVENTORY.md)
- [`docs/product/features/catalog-backed-selectors.md`](docs/product/features/catalog-backed-selectors.md)

## Stack

- **Node.js 24.15.0**
- **TypeScript**
- **Fastify 5**
- **GraphQL Yoga** at `/graphql` (Phase 0 integration)
- **PostgreSQL 16**
- **Drizzle ORM** on **node-postgres (`pg`)**
- **Drizzle Kit** for schema-driven migrations
- **React 19**
- **Vite 8**
- **Tailwind CSS 4**
- **Vitest** and **Testing Library**
- **pnpm workspaces** (`api`, `web`)

The product API is GraphQL. Operational endpoints may exist only when infrastructure needs them.

## Repository layout

```text
api/                           Node/TypeScript + Fastify + GraphQL
web/                           React + Vite + Tailwind
db/migrations/                 Drizzle Kit-managed SQL migrations
db/seeds/                      Seed source data
docs/product/features/         Detailed product specifications
docs/design/components/        Shared interaction/component specifications
docs/design/wireframes/        Screen/state wireframes
docs/design/flows/             Cross-screen flows
docs/architecture/adr/         Technical ADRs only
docs/engineering/              Delivery/test/seed/traceability plans
.codex/                        Codex configuration + subagents
.agents/skills/                Reusable Codex workflows
scripts/                        Environment utilities
AGENTS.md                       Repository-wide Codex instructions
```

## Setup

Prerequisites:

- Node.js 24.15.0 (see `.nvmrc`)
- pnpm 12+
- Docker with `docker compose`

```bash
cp .env.example .env
docker compose up -d
pnpm install --frozen-lockfile
pnpm verify
```

Development:

```bash
pnpm dev
```

- Web: `http://localhost:5173`
- API host: `http://localhost:3001`
- Liveness: `http://localhost:3001/livez`
- Database readiness: `http://localhost:3001/readyz`
- GraphQL foundation API: `http://localhost:3001/graphql`

`pnpm verify` creates and removes its own temporary database; it never migrates the database named in `DATABASE_URL`.

## Working with Codex

A good first prompt is:

> Read `AGENTS.md`, `docs/product/PRD.md`, `docs/product/FEATURE_STATUS.md`, `docs/product/PAGE_INVENTORY.md`, `docs/product/features/application-shell.md`, `docs/product/features/catalog-backed-selectors.md`, `docs/architecture/adr/README.md`, and `docs/engineering/IMPLEMENTATION_PLAN.md`. Summarize the plan and execute **Phase 0 only**. Do not start later phases.

For a feature, tell Codex to read that feature's detailed spec and wireframe before planning or implementation.

## Documentation authority

Decision ownership is by concern rather than one global precedence list:

- Product behavior/scope: `docs/product/PRD.md` + detailed feature spec.
- Page/interaction behavior: feature spec + `docs/design/`.
- Technical architecture: accepted ADRs + architecture docs.
- Delivery sequencing: implementation plan + traceability.

An ADR is not a place to store ordinary product requirements, UI choices, or acceptance criteria.

## Current state

The repository contains the reviewed platform foundation and planning material. Product features are intentionally not implemented yet. Fastify, GraphQL Yoga, Drizzle ORM, PostgreSQL, and pnpm provide the foundation for later phases.
