# Phase 11 — Initial release validation

Status: **PLANNED**. Implementation: **Not Started**. This document plans work only. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Validate the integrated initial product against its complete coverage matrix and close cross-domain release risks. This phase is not a substitute for tests/accessibility in earlier slices.

## Dependencies

00–10, R1 and R2 accepted; every initial OPEN QUESTION resolved and owning specs updated. Q10 is resolved before either Resume phase starts. No outstanding P0 or affected initial-release P1 finding.

## Product requirements covered

All initial AUTH/APP/PRO/PER/CAT/SKL/EXP/EDU/CERT/FOC/ONB/ADM/TBL/RES criteria. Coverage must distinguish fully delivered and pending criteria; a Q10-blocked Resume criterion is not complete.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Keep architecture stable. Profile projections use batch/join repositories, bounded search/table operations and scoped server state. Validate production build/deploy topology and cookie/Origin behavior. No late adoption of a second cache/search/database framework without measured need and review.

## Database work

Run clean PostgreSQL16 migration and seed replay, upgrade-path checks, constraint negatives and concurrent source/custom/focus scenarios. EXPLAIN catalogs/Admin and measure query counts for large synthetic profiles. Review deletion FK topology for future compatibility; do not build or test a complete future account-purge workflow without that requirement. Verify backups/restoration and least-privilege runtime/migration roles for selected deployment.

## GraphQL work

Operation inventory matches generated clients; stable codes/scalars, viewer null/error semantics, no sensitive fields, bounded queries/aliases and no GET mutations. Verify direct-ID privacy and admin projection. Test reset against in-flight authenticated operations and session-generation invalidation.

## Backend work

Review transactions, logging redaction, validation, production config, safe shutdown, timeouts, readiness, rate limiting and error sanitization. No seeds/dev credentials outside explicitly disposable environments. Document service run/build/migrate/seed/restore commands and failure recovery; no deployment is performed as part of planning.

## Frontend work

Full responsive/accessibility/error-boundary review across auth/Account/Profile/Focus/Admin/Resume; loading/empty/no-results/error/save states, stale response races and independent section retry. Real drag/Move/× persistence and rollback. Verify active Resume chooser/import/generation/status/preview/download flows, with no duplicate CTA or stale menu destination. Clear caches and requests across account switches.

## Design artifacts

[Artifact audit](../reviews/artifact-audit.md) plus every phase-approved artifact. Review representative 320/390/768/1280 states and changed interaction specimens; all-pages is a coverage aid, not proof of runtime parity. Verify semantic toast surfaces, count badges, placeholders and focus card patterns.

## Accessibility

Keyboard-only critical journeys, VoiceOver dialogs/combobox/menus/palette, zoom/reflow, focus non-obscuring, labels/errors/live regions, touch drag isolation, target size, contrast and reduced motion. Manual checks complement axe. Do not claim full WCAG conformance solely from automated scans.

## Tests

Run pnpm typecheck/test/verify plus production build. DB integration isolation, deterministic seed reruns, cross-user/API negatives and multi-source concurrency suite. Browser journeys: register/onboard; all global/custom profile domains; skill drag/Move/remove; Focus order; admin create/reset. Test failure/retry/offline cases and two browser sessions. Record command results and environment versions.

## Observability

Confirm useful safe logs and basic request/query latency/error measurements. Operational audit shows admin changes; no PII/credential leakage. Add deployment alerts only for concrete availability/errors on the selected host; avoid speculative observability infrastructure.

## Acceptance criteria

Every approved initial criterion has actual evidence in COVERAGE; a gated omission is not a pass and requires an explicit owning-spec amendment before release; no family marked done from mockups alone. No unresolved initial P0/P1. Clean install/build/migration/seed and full critical journeys, including Resume import and generation, pass; no global/private leaks, source loss, unauthorized artifacts, or ungrounded generated facts. Release scope excludes only approved deferred Settings extras.

## Risks

Hardening becoming an unbounded redesign, tests passing only on the developer DB, hiding known failures behind generic compliance claims, and treating illustrative Resume artifacts as proof of durable, grounded behavior.

## Human review checkpoint

Human go/no-go review of coverage, security/data invariants, browser/accessibility evidence, operational runbook and remaining P2/P3. Product confirms scope and approved exceptions. A later deployment requires its own authorized task.
