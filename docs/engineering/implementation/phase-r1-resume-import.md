# Phase R1 — Resume import and reviewed merge

Status: **PLANNED**. Implementation: **Not Started**. This document plans work only. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Import PDF/DOCX into reviewable candidate profile changes, preserving saved facts and RESUME_IMPORT provenance.

## Dependencies

Complete Profile domains and Q10 approval are required. Q10 approves limits, retention/deletion, storage/job/parser/provider data handling, review/merge design and incident cleanup. This document does not select those technologies.

## Product requirements covered

[Resume](../../product/features/resume.md) RES-AC-001–004; approved PRO-AC-004/RES-00 chooser availability. New AC needed for retention/access/merge conflicts before implementation.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Upload bytes through an approved storage transport and product orchestration through GraphQL. Durable job state machine separates upload, validation, processing, review, accepted/failed/canceled states as approved. Parser output is untrusted candidate data. Domain services remain the only authoritative profile write path.

## Database work

Propose resume_imports/artifacts/jobs with owner FK, storage key, MIME/size/checksum, status, timestamps, error code and retention deadline; candidate/review selections and source IDs require a reviewed schema. Add RESUME_IMPORT source type with typed import FK and uniqueness. Accepted merge atomically resolves catalogs, adds approved records/skill sources and marks selections applied; repeat acceptance idempotent. Reuse global/private constraints; never seed actual personal resumes.

## GraphQL work

Proposed beginResumeImport, resumeImport(id)/status, reviewResumeImport, acceptResumeImportSelections; final names/inputs reviewed before SDL. Inputs include supported metadata and reviewed snapshot fingerprint and import revision; URLs/status/results always owner-authorized. Errors: invalid format/size, processing failure, expired artifact, changed-since-review conflict, duplicate acceptance. No arbitrary storage key or userId accepted.

## Backend work

Validate content/MIME/extension/size, isolate parsing, define scanning strategy, enforce retention and retry limits. Durable job lease/idempotence; no long external call inside profile transaction. Review merge never silently overwrites existing records; a profile modified during processing triggers conflict review. Access-controlled download/upload grants expire.

## Frontend work

One compact Profile CTA opens chooser; import file picker/drop zone→real processing milestones→candidate review→explicit merge→success/failure/retry. Draft reviewed data never appears as saved profile prematurely. Missing review/merge/error/expired artifacts must be designed before building; account navigation unchanged.

## Design artifacts

[Chooser](../../design/artifacts/profile/resume-tools.html), [upload](../../design/artifacts/resume/upload.html), shared processing/modal baseline, [Resume wireframe](../../design/wireframes/resume.md). Existing processing.html illustrates generation, not a complete import review design. New candidate diff/accept/conflict/retry states required.

## Accessibility

File picker equivalent to drop, labelled file errors, durable status announced without fake percentage, accessible candidate-selection/review, focus restoration and keyboard accept/retry. Large review content remains usable on narrow layouts.

## Tests

Unit: file policy/candidate validation/merge rules. DB: owner isolation/atomic idempotent merge/source FK. API: unauthorized artifacts, stale revision/replay/expiry. Worker integration: malformed fixture, crash/retry, retention deletion and provider failure. UI/browser: review subset then accept, reject others, no silent overwrite and RESUME_IMPORT source distinct from MANUAL. Use synthetic fixtures only.

## Observability

Job ID/status transitions/duration and safe parser errors; retention cleanup evidence; no resume text in ordinary logs. Provider cost/timeout metrics only if applicable after selection.

## Acceptance criteria

RES-AC-001–004 pass with durable status and explicit review before writes. Accepted imports retain source identity; unsupported/private/expired files fail safely; retry cannot duplicate records. Required retention and provider decisions have actual tests/runbook.

## Risks

Private document exposure, malicious parser inputs, extraction inventing facts, partial merge and duplicate retries. Storage/jobs/parser remain Q10 gates; do not pretend a provider placeholder is a finished design.

## Human review checkpoint

Product/security approve file lifecycle, provider terms/data handling, candidate review and merge semantics before implementation begins; review integrated failure/access evidence before releasing import.
