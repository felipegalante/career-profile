# Phase 02 — Profile identity and application shell

Status: **PLANNED**. Implementation: **Not Started**. This document plans work only. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Create the primary Profile workspace, Account personal-information experience and accessible permission/context-aware shell. Provide truthful empty placeholders for later domain slices. Add required-personal-data onboarding and completion in 02C so registration can reach Profile before optional domain integration.

## Dependencies

01A required; 01B required only for setup-specific journeys. Resolve Q06 personal/settings/title/completeness scope and Q09 mobile navigation. Accept shell/Account route map. Incomplete-user guard remains active.

## Product requirements covered

[Profile](../../product/features/profile-shell-overview.md) PRO-AC-001–011, [Personal Information](../../product/features/personal-information.md) PER-AC-001–005 and [Application Shell](../../product/features/application-shell.md) APP-AC-001–008. PRO-AC-002 finishes with Work/Skills/Education/Certifications in 03–07; PRO-AC-004 is fulfilled in active R1/R2, not by an inert Phase 02 CTA.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Profile service owns personal fields and viewer projection. Shell owns routes/static command list and overlay arbitration; UI hiding is not authorization. Account/Profile and Account/Settings are tabs of one area. No standalone primary Experience/Education/Certifications/Skills routes. Use a small static list of implemented commands and explicit role/context predicates. No plugin registry or feature-registration framework.

## Database work

Add personal fields and timestamps to base user_profiles; backfill one profile per existing user. Required-on-completion names/country/language may be null before completion. Validate DOB/URLs and supported enums; no ethnicity/community/gender fields. Slice 02C introduces idempotent completion under a user/profile transaction, validating required saved fields before setting onboarding_completed_at; no progress table. No completeness score/title column without Q06. Update profile with ownership protection; seed empty/partial/complete identities.

## GraphQL work

viewer.profile, updateProfile(input). Stable field errors, UNAUTHENTICATED, NOT_FOUND/inaccessible ownership and validation errors. Ordinary full-form updates use documented last-committed-write behavior; do not impose revision tokens on every CRUD operation. Slice 02C adds completeOnboarding using saved names/country/language and returning canonical completion state; clients cannot supply the timestamp. No ordinary userId argument. Only approved Settings operations: sign-out exists; self-password-change requires separately approved AC, reauthentication and service contract before implementation.

## Backend work

Profile repository selects by context user; validate nonblank names, nonfuture DOB, http(s) LinkedIn URL and supported country/language. Completed users cannot clear required completion fields. Server route-equivalent authorization rejects unauthenticated requests; upcoming onboarding services reuse these operations.

## Frontend work

Build AppShell/sidebar/drawer/avatar menu/Account tabs and CommandPalette. Meta/Ctrl+B toggles without remount; Meta/Ctrl+K opens authorized context commands. Empty Profile renders all five placeholders, adding functional domain actions as slices land; do not render dead Save actions or claim them complete. Account supports all specified fields, cancel/discard, loading/error/retry. Resume Tools CTA and command arrive with the functional R1/R2 flows, not artifact availability. Slice 02C composes personal/career fields into the seven-step shell, supports optional skips and an explicit review/finish action. Missing optional editors are internal development scope until their domain slices; this is not complete onboarding feature acceptance.

## Design artifacts

[Profile](../../design/artifacts/profile/profile.html), [empty Profile](../../design/artifacts/profile/overview-empty.html), [avatar](../../design/artifacts/profile/avatar-menu.html), [Account](../../design/artifacts/profile/account.html), [Settings](../../design/artifacts/profile/account-settings.html), [edit](../../design/artifacts/profile/personal-edit.html), [sidebar](../../design/artifacts/design-system/shell/sidebar.html), [palette](../../design/artifacts/design-system/components/command-palette.html). Correct incomplete forms/mobile navigation and remove or define unsupported metrics before acceptance.

## Accessibility

Palette labelled modal with search/active-option/Arrow/Enter/Escape and focus restoration; no stacking over another modal. Visible shortcut triggers and platform hints/aria-keyshortcuts. Preserve rich-text bold while accepting shortcuts from normal inputs. Drawer focus trap/restoration, collapsed icon names, semantic tabs and route focus. Mobile 320/390/768 checked.

## Tests

Unit: command role/context predicates and profile validation. DB/API: foreign-owner ID, required-field preservation and two-tab last-committed-write behavior. Component: all eight APP criteria, account save/cancel/errors, five empty placeholders and no duplicate CTA. Browser: direct links/back, role gating, drawer and keyboard-only Account/Profile journey. Contrast/axe plus manual focus review. 02C browser/API tests cover register → required values → skip optional → finish → Profile, duplicate finish, missing-field denial and retained draft after failure.

## Observability

Profile load/update duration and safe error codes; no personal-field logging. Capture uncaught UI errors with route/component context only if an existing error sink is available; no new telemetry platform.

## Acceptance criteria

PER passes; APP shell mechanics pass, while contextual commands remain partial until domain actions exist; shell preserves local forms/route on collapse. PRO structure/empty/account/admin visibility criteria pass; populated-domain mobile and focused-surface checks remain partial until the real domains arrive. Later-domain management is recorded partial until 03–08 and Resume Tools until R1/R2. Required-fields onboarding can complete with all optional steps skipped in 02C; full onboarding acceptance waits for 09. No invented completion percentage or Settings action.

## Risks

Feature availability vs role gating, preserving focus after command opens a form, loss of Profile state on secondary surfaces, premature claims of full PRO-AC-002 completion.

## Human review checkpoint

Product/design review of Account fields, mobile navigation, empty Profile and Resume decision; keyboard walkthrough of every command/sidebar rule. Approve shell contract for all later consumers.
