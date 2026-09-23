# Architecture

## Runtime

```text
React 19 + TypeScript + Vite + Tailwind
              │
              │ GraphQL
              ▼
Fastify 5 + GraphQL Yoga
              │
        application services
              │
          repositories
              │
        Drizzle ORM + pg
              │
         PostgreSQL 16
```

The application is a modular monolith. Product/domain HTTP behavior is GraphQL; `/livez` and `/readyz` are operational only.

## Backend modules

- auth/account
- profile
- work experience
- education
- certifications
- professional focus
- skills
- catalog search/shared lookup infrastructure
- admin

Modules own domain rules and repositories but can collaborate through explicit application services.

## Catalog-search infrastructure

Most structured profile inputs use domain-specific catalogs with a shared search contract. Search helpers centralize normalization, exact/prefix/substring/trigram ranking, visibility predicates (`GLOBAL OR viewer-owned`), pagination/limits, and stable error mapping. Domain repositories apply those helpers to their own tables and parent relationships.

Do not collapse all catalogs into one generic EAV/polymorphic table solely for reuse.

## Dependent lookup relationships

```text
Company → Job Title
Institution → Major / Specialization → Degree Type
Certification Board → Certification / Exam
```

Parent context is passed into domain search services. Known relations influence result filtering/ranking. Custom parent selections can use fallback global vocabularies plus custom child entry according to product specs.

## Skill derivation/provenance

Experience/Education/Certification services may call a derivation boundary that proposes skill definitions. The Skills service resolves definitions and provenance transactionally. Initial derivation can be deterministic seeded mappings; the architecture does not require an external AI provider.

## Frontend architecture

The `@career-profile/ui` workspace package ([ADR 0011](adr/0011-shared-ui-workspace-package.md)) provides tokens, primitives, the application shell and presentational compositions, built on React Aria Components ([ADR 0012](adr/0012-react-aria-components.md)) and CSS Modules over the artifact tokens ([ADR 0013](adr/0013-css-modules-over-artifact-tokens.md)). The package never imports GraphQL, the router or domain rules; `web` wires data, routing and permissions. Feature pages share design-system primitives plus two higher-level reusable patterns:

- `CatalogCombobox`: search/select/custom behavior and dependent-parent gating.
- `ProfileRecordDialog`: accessible dialog shell, form actions, loading/error conventions.

Feature forms compose these patterns but retain domain-specific field validation and mutation logic.
