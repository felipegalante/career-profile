# Phase 08 — Professional Focus

Status: **PLANNED**. Implementation: **Not Started**. This document plans work only. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Deliver a flexible, ordered professional-direction selection with optional primary and private custom values.

## Dependencies

02 and the catalog search/custom pattern from 03/04A are required; Q08 settles exact normalization. A searchable edit dialog is already consistent with the Focus spec and page inventory; no new product gate is needed for inline versus dialog presentation. R11 concurrency/order constraints approved. No dependency on recommendation/assessment functionality.

## Product requirements covered

[Professional Focus](../../product/features/professional-focus.md) FOC-AC-001–006; CAT-AC-001–007/010; PRO-AC-002/010/011 Focus summary and navigation.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Focus service owns ordered set and optional primary. Catalog definitions separate from per-user choices. One aggregate revision protects whole-list replacement; avoid adding independent mutations just to mimic another domain when atomic selection save is clearer.

## Database work

Create focus_areas with scope/owner normalized uniqueness and user_focus_areas with unique user/definition, nonnegative order and at-most-one-primary partial index. Store a dedicated focus revision on user_profiles, not a general profile revision. Lock/check aggregate on save, resolve custom drafts, delete and insert the validated ordered set and bump revision atomically; no temporary order collisions. Seed 20 areas with safe icon keys; private/custom and empty fixture.

## GraphQL work

searchFocusAreas(input) canonical name; viewer.professionalFocus; updateProfessionalFocus(input selections/order/optional primary/expectedRevision) returns ordered canonical list and revision. Validate every definition and prevent normalized duplicates. UNAUTHENTICATED, invalid selection, duplicate, CONFLICT errors; no hard top-five cap.

## Backend work

Visibility applies to reads/direct IDs/custom reuse. Primary must reference a selected item; removing it leaves none. Concurrent stale saves return conflict rather than silently replace list. Use server validated sort positions and bounded request payload for transport safety without inventing a product selection cap.

## Frontend work

/profile/focus with Back to Profile, neutral icon cards, Primary badge and shared search/custom. Actions: set primary, move up/down, remove; persist ordering and reload. Profile summary entry and onboarding reuse later. One primary CTA, loading/empty/error/no-result/pending states; retain unsaved draft after failure. Use the documented searchable edit dialog; do not introduce a configurable editor mode.

## Design artifacts

[Focus](../../design/artifacts/focus/focus.html), [empty](../../design/artifacts/focus/focus-empty.html), [search](../../design/artifacts/focus/focus-search.html), [edit](../../design/artifacts/focus/focus-edit.html), [wireframe](../../design/wireframes/professional-focus.md). Add reorder/primary menu and conflict state; align seed/example names without treating current artifact labels as authoritative taxonomy.

## Accessibility

Reordering has Move up/down keyboard actions with disabled boundaries and announcement; removing preserves useful focus; primary communicated by text. Search and menu use shared semantics. Icons decorative or named as appropriate; no color-only left stripe.

## Tests

Unit: primary/order set validation. DB: concurrent primary selection, order replacement under lock, private definitions and revision conflict. API: atomic mixed custom/global save and reload. Component: keyboard reorder/remove, primary removal leaves none, no cap, error draft preservation. Browser: edit from Profile and verify persisted order across session.

## Observability

Safe save/conflict/error metrics; log counts not private focus labels. No ranking/recommendation telemetry or job infrastructure.

## Acceptance criteria

FOC-AC-001–006 pass; all eligible catalog/private behavior covered. At most one primary under race; no arbitrary top-five limit; saved order stable; removing primary does not choose another. Cards and Back to Profile match approved design.

## Risks

Whole-list stale writes, transient sort-order uniqueness collisions and confusing a searchable dialog with forbidden fixed checklist behavior.

## Human review checkpoint

Product/design approve editor and reorder behavior; engineering reviews concurrent whole-list save evidence. Confirm reusable Focus form is ready for onboarding.
