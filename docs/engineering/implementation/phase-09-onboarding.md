# Phase 09 — Complete onboarding integration

Status: **PLANNED**. Implementation: **Not Started**. This document plans work only. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Finish and verify the seven-step onboarding journey already built incrementally in 02C and the domain slices. Do not wait until this phase to discover whether Profile forms can be used during onboarding.

## Dependencies

01–08 complete for their relevant reusable features. Seven-step feature-spec authority and required fields are preserved; any additional progress-resume behavior under Q04 needs approval, and missing artifacts must be reviewed. No production bypass of incomplete-user guard during earlier phases.

## Product requirements covered

[Onboarding](../../product/features/onboarding.md) ONB-AC-001–008; AUTH-AC-008 final routed journey; existing PER/EXP/EDU/CERT/FOC/SKL behavior reused, not redefined.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Onboarding orchestrates existing profile mutations and a completion service; no second domain data store. Seven steps follow the authoritative feature spec: personal, career, optional work, optional education/certification, optional Focus, optional Skills, review/finish. A different count is a product scope change, not an engineering prerequisite. Q04 concerns additional resume/navigation guarantees beyond persisted profile data.

## Database work

Reuse completion handling introduced in 02C and all saved domain records. No default progress table/current-step migration: existing requirements promise persisted profile data, not a durable wizard engine. Reentry can display saved values through the same queries; an exact resume-position guarantee requires approved Q04 criteria. Seed unfinished and completed/reset accounts; completion remains idempotent and optional skip creates no placeholder rows.

## GraphQL work

viewer onboarding progress and profile; no updateOnboardingProgress mutation unless an approved requirement needs a saved step cursor; completeOnboarding returns canonical user/state. Reuse updateProfile and domain mutations. Server checks required names/country/language and session/setup state; caller cannot supply completion timestamp. Stable validation/conflict/retry errors; no normal-route permission from only client step state.

## Backend work

Step save delegates to existing services. Idempotent finish; persist only acknowledged saves, preserve earlier data when stepping back. Reentry reloads saved profile values; an exact saved-step cursor is added only if Q04 explicitly requires it. Setup always precedes onboarding; reset of already completed user returns to Profile after password setup. Define cancel/skip semantics around already-saved optional records explicitly.

## Frontend work

/onboarding shared two-panel public shell; same professional-story visual on every desktop step, responsive single column. Compose actual catalog/dialog fields and removable skill chips; no four-step fork. Required personal step has no bypass to completion; optional steps show Skip. Show save errors without losing draft; navigation waits for save result. Review step summarizes saved state and Finish completes.

## Design artifacts

[Basics](../../design/artifacts/onboarding/basics.html), [career](../../design/artifacts/onboarding/career.html), [Focus](../../design/artifacts/onboarding/focus.html), [Skills](../../design/artifacts/onboarding/skills.html) supply appearance; [seven-step wireframe](../../design/wireframes/onboarding.md) supplies the authoritative seven-step sequence. New work/education-certification/review/progress-error variants required. Correct country/Skip and catalog Focus omissions.

## Accessibility

Announce step name/progress without a noisy decorative progress bar; focus new heading/first useful input, preserve Back focus and invalid-field links. Optional Skip is semantic and descriptive. Keyboard-accessible × updates live selection; illustrations not read as duplicate forms. Validate screen-reader and narrow-screen completion journey.

## Tests

Unit: step transitions/finish preconditions. DB/API: atomic timestamp, repeat finish, incomplete guard and saved-field validation. Component: back/skip/retry/retained draft and illustration continuity. Browser: public register→all steps→Profile; skip every optional step; exit/reload resume; first-password→onboarding; reset completed account bypasses onboarding. Verify data unchanged in Profile.

## Observability

Step-save/finish safe error and duration; record no personal content or passwords. Aggregate failed-step counts useful for debugging; no behavioral analytics platform.

## Acceptance criteria

All ONB-AC-001–008 and final AUTH-AC-008 pass. Required fields cannot be skipped past finish, optional skips create no rows, previous persisted data remains, and chip removal persists under shared semantics. Normal routes remain guarded until explicit completion.

## Risks

Accidental duplicate saves on retry/back, confusing local selections with persisted Skills, undefined Save & exit semantics and claiming completion before all source components exist.

## Human review checkpoint

Product approves full new-user and reset-user journeys; QA reviews every skip/retry/resume branch and data parity with Profile. Confirm seven-step parity with the feature spec and required-field enforcement; no late domain-form implementation hidden in this milestone.
