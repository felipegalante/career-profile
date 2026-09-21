# Implementation Plan

> **SUPERSEDED delivery sequence (2026-09-20).** Use the [revised phased plan](implementation/README.md), [dependency map](implementation/DEPENDENCIES.md), and [criterion coverage](implementation/COVERAGE.md), informed by the [architecture readiness review](reviews/architecture-readiness.md). The sequence below is retained as historical planning context; its phase numbers and completion claims must not guide new implementation. No phase has started. Product specs and accepted ADRs are not superseded by this planning change.

Each phase should end with tests green, documentation synchronized, and human review before beginning the next phase.

## Phase 0 — Foundation

- switch workspace/tooling to pnpm;
- Fastify API bootstrap and operational health route;
- GraphQL Yoga `/graphql` integration;
- Drizzle ORM/Drizzle Kit schema/migration foundation;
- PostgreSQL connection/configuration;
- app-level error/context conventions;
- base design tokens/primitives;
- shared keyboard-shortcut dispatcher + CommandPalette primitive;
- shared DataTable primitives (pagination/filter/sort contracts).

## Phase 1 — Authentication and sessions

- users/sessions schema;
- password hashing/validation;
- register/login/logout/viewer;
- shared PasswordInput with show/hide control;
- admin-created/reset password-setup-required flow;
- Fastify cookie/session integration;
- route guards and admin authorization foundation.

## Phase 2 — Catalog search foundation + seeds

- `pg_trgm` migration/index helpers;
- shared normalization/ranking/visibility utilities;
- global/user catalog scope pattern;
- `CatalogCombobox` and dependent-field behavior;
- seed loaders for companies, job titles, institutions/programs, certification boards/exams, focus areas, skills;
- cross-user custom-value isolation tests.

## Phase 3 — Profile + onboarding + Professional Focus

- user profile schema/operations;
- onboarding routes/steps;
- single Profile workspace combining experience, skills, education, certifications, focus summary, and resume CTA;
- Account page with Profile/Settings tabs opened from bottom avatar menu;
- focus-area catalog and ordered/primary selections.
- authenticated AppShell integration with Cmd/Ctrl+B sidebar toggle and Cmd/Ctrl+K permission-aware command palette.

## Phase 4 — Work Experience

- company/job-title catalogs and associations;
- Company → Job Title dialog flow;
- work experience CRUD/date rules;
- list/empty/edit states.

## Phase 5 — Education and Certifications

- institutions, majors/specializations, degree types, institution-program offerings;
- Institution → Major / Specialization → Degree Type flow;
- certification boards/definitions;
- Board → Certification / Exam flow;
- education/certification CRUD and validation.

## Phase 6 — Skills

- skill catalog/custom definitions;
- user skills/proficiency;
- search/add/custom/remove;
- functional accessible chip `×` removal with optimistic update/rollback and count reconciliation;
- required drag-and-drop plus keyboard Move menu;
- view/edit/expand states;
- drag + accessible Move menu;
- optimistic proficiency updates where appropriate.

## Phase 7 — Cross-domain skill provenance

- `UserSkillSource` persistence/reconciliation;
- experience/education/certification derived-skill mapping;
- source previews and safe source deletion semantics.

## Phase 8 — Admin

- paginated/filterable/sortable/searchable users DataTable;
- admin-create user/admin without assigning a password;
- admin reset-password action;
- authorization tests/UI.

## Phase 9 — Hardening

- responsive/accessibility pass;
- query/index review;
- error/loading consistency;
- E2E critical journeys if adopted;
- seed/migration clean-database verification.

## Resume

Implement resume upload/import/generation only after its technical architecture is separately accepted.
