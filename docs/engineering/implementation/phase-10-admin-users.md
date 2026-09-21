# Phase 10 — Admin Users and server-backed tables

Status: **PLANNED**. Implementation: **Not Started**. This document plans work only. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Deliver authorized user browsing, account creation and forced reset through one fixed-column server-backed table.

## Dependencies

01/02 required; 02C supplies the minimum new-account completion journey; 09 owns the final all-optional-domain onboarding E2E. Admin slices can be accepted earlier without pretending that cross-domain release evidence exists. Q01 safe setup delivery operational. Approve offset pagination contract and audit retention; no self-reset/last-admin restriction invented without product approval.

## Product requirements covered

[Admin Users](../../product/features/admin-users.md) ADM-AC-001–007; [Data Tables](../../product/features/data-tables.md) TBL-AC-001–006; AUTH-AC-005/006 and PRO-AC-008/APP-AC-004 role enforcement.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Admin service authorizes every operation and uses a narrow users projection. A local Admin controller owns URL state/search/filter/sort/page reset; native semantic table with fixed columns. Choose offset/page for random-page navigation/exact totals; no additional cursor standard or all-users client filtering.

## Database work

Use users/profile identity/session/setup-grant tables from prior phases; introduce the minimal admin_audit_events table with actual create/reset operations here. Add measured created/name/filter indexes, deterministic ID sort tie-break, and any password-changed metadata only if Q06 approved. Paginated rows/count share filters and snapshot. Creation atomically makes passwordless role/user/profile/grant/audit; reset atomically invalidates password/sessions/grants while retaining completion. Test fixture has >2 pages and tied sort values.

## GraphQL work

adminUsers(AdminUserListInput) → AdminUserConnection rows/total/page/pageSize/pageCount/range/hasNext/hasPrevious. Input supports name/email search, role, COMPLETE/INCOMPLETE, CREATED_AT/NAME sort and direction; defaults newest/page1/25, allowed sizes 10/25/50/100. adminCreateUser has optional names, email, USER/ADMIN role, no password. adminResetPassword(userId) returns safe setup outcome. FORBIDDEN before data access; duplicate/invalid email, invalid page and conflict handled.

## Backend work

Parameterized search/filters, max page size and stable null-name sorting. Reset count/page after filtering, handle page beyond final range. Reuse auth lifecycle service, do not duplicate credential logic in admin resolver. Sanitize audit outcome and setup proof display/delivery. A regular USER cannot access these operations by forging GraphQL or opening deep links.

## Frontend work

/admin/users: one header Create user, expanding search, neutral role/onboarding/sort controls, real pagination/page-size/range. URL preserves browse state and back/forward. Loading/empty/no-results/error distinct; stale rows visibly updating. Create dialog and reset confirmation preserve form input, show pending/error and approved delivery instructions. Mobile named horizontal scroll region or approved cards; no document-level overflow.

## Design artifacts

[Users](../../design/artifacts/admin/users.html), [create](../../design/artifacts/admin/users-create.html), [reset](../../design/artifacts/admin/users-reset-password.html), [table component](../../design/artifacts/design-system/components/admin-table.html), [collection states](../../design/artifacts/design-system/states/collection-states.html). Fix sample order/range and add domain empty/no-results/error/loading variants; create dialog submit is not a duplicate page CTA.

## Accessibility

Table caption/header scopes, aria-sort, named filters/search, labeled pagination with real disabled state and range announcements. Preserve focus on page updates; row actions name their user. Dialog focus/confirmation and keyboard horizontal scrolling. Admin commands absent for users; visible UI is not security boundary.

## Tests

Unit: list input/URL codec/page reset. DB: stable tied ordering, filtered count/range, multiple pages, null names and SQL plans. GraphQL: forbidden USER/all combinations/duplicate email/create/reset. Component: back/forward, page-size, no-results vs empty, loading/error. Browser: admin creates USER and ADMIN without password; approved proof setup→onboarding; reset completed user→new password→Profile; prior sessions rejected.

## Observability

Admin create/reset audit actor/target/action/time/request ID/outcome; no credentials. Query latency and result count; auth throttle/reset failures. Retention bounded by approved operational policy; no event bus.

## Acceptance criteria

ADM-AC-001–007 and TBL-AC-001–006 pass. All table behavior is server-backed with matching totals/order; regular user denied at API and route. Password setup and onboarding remain independent through all admin flows. One page-level Create user.

## Risks

Count/data snapshot mismatch, deep offset cost, leaking private profile data through broad User type, reset races and setup-secret disclosure. Review last-admin/self-reset policy only if product introduces restrictions.

## Human review checkpoint

Admin product owner verifies create/reset messaging and delivery; engineering reviews SQL/authorization/audit tests; design checks mobile and table states. Full first-access/reset journeys must pass before release.
