# Phase 00 — Reproducible foundation

Status: **IN REVIEW**. Implementation: **Complete pending human review**. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Establish a buildable, testable runtime before adding domain behavior. Close foundation cleanup findings R16–R18 and prepare contracts for the first authenticated slice.

## Dependencies

Review this technical sequence and preserve accepted ADRs 0001/0002/0009/0010. Neither Q01 proof delivery nor Q11 token choice blocks runtime, migration tooling or CI work; their gates attach to 01B and the first styled UI respectively.

## Product requirements covered

Enables AUTH-AC-001–008, CAT-AC-001–010, APP-AC-001–008 and TBL-AC-001–006; does not claim these feature criteria complete. Technical gates FND-01–06 below are phase acceptance, not invented product AC.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Keep Fastify application factory separate from process bootstrap. Integrate Yoga through a tested adapter at `/graphql`; compose explicit modules and request context. Establish API-owned database commands and injectable DB access for the smoke test. Auth introduces its clock, error contracts, real operation types and fetch boundary with actual consumers in 01. Add only dependencies approved for 00 in the dependency assessment; do not build all reusable domain components now.

## Database work

Add Drizzle schema/config/journal foundation and one reviewed baseline migration path. Reconcile existing SELECT-1/schema_migrations history explicitly; no duplicate runner. No domain table beyond infrastructure needed for smoke tests. Define transaction handle conventions, extension deployment requirements and disposable integration DB setup. No product seed load until owning schemas exist; validate seed source files without silently fixing references.

## GraphQL work

Mount and smoke-test minimal non-domain query/schema wiring. Validate malformed requests and GraphQL error redaction; use a single minimal schema; explicit module assembly and client codegen arrive with auth operations in 01. Transport context can be anonymous until 01. Document mutation-only POST, Origin/CSRF integration, body/depth/alias budgets and search/table maximum conventions; no product REST API.

## Backend work

Align Node 24 patch/typings; review and generate pnpm lockfile; move DB scripts into API ownership; add validated env loading and fail-closed deployed config. Add graceful Fastify/pool shutdown, sanitized liveness/readiness, request ID and redaction. Verification must use a disposable DB and uniquely identified child API, never accidentally accept an old process. Add build and CI commands.

## Frontend work

Retain the existing honest scaffold and prove its build. No new tokens, component library, icons, form primitives, cache, router, generated client or toast system in this phase. Auth introduces necessary controls and Q11 tokens in 01; shell-specific primitives arrive in 02.

## Design artifacts

No artifact rewrite or visual framework is a foundation prerequisite. Reference [color](../../design/artifacts/design-system/color/color.html) and [type/layout](../../design/artifacts/design-system/type-layout/type-layout.html) when resolving Q11 for the first auth UI in 01.

## Accessibility

Preserve the scaffold semantics. Token contrast, password toggle, field/error announcements and focus states are explicit exit checks of the first rendered auth slice in 01, not unconsumed foundation components.

## Tests

Unit: env parsing/redaction/errors. DB: baseline migration on empty database and rerun. GraphQL/Fastify: real integration, content type, bad input, safe errors. Verify the existing built frontend and API smoke without adding a browser harness. Field/password/toast and browser cookie tests belong to 01. CI runs typecheck, test, build and isolated verify; no unprovided DB in unit smoke tests.

## Observability

Enable structured request ID, operation name, duration and safe error codes. Redact cookies, credentials, grants and DB URL. Readiness failure is sanitized; logs distinguish startup/config/DB failure without profile data. No monitoring service dependency.

## Acceptance criteria

- FND-01: tested Node/pnpm versions and frozen install are reproducible.
- FND-02: Yoga works through Fastify with a safe minimal schema.
- FND-03: one Drizzle migration path works twice on disposable DB.
- FND-04: failed verify cleans up its owned API and never prints credentials.
- FND-05: build/typecheck/test/verify report real outcomes in CI.
- FND-06: Runtime/tooling cleanup rows assigned to 00 close; visual primitives and artifact hygiene are assigned to their consuming slices.

## Risks

Changing migration history on a previously used local DB, native hashing support in the next phase, compatibility of current peer versions and accidental overbuilding of shared primitives. No product decision is resolved merely by library choice.

## Human review checkpoint

Review locked dependency diff, environment/build commands, migration transition, actual CI output, safe health behavior and reproducible commands. Q01 remains mandatory before password setup in 01B. Stop after this foundation review; do not begin auth implicitly.
