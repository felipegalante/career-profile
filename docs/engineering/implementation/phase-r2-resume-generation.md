# Phase R2 — Grounded resume generation

Status: **PLANNED**. Implementation: **Not Started**. This document plans work only. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Generate a factual ATS-friendly document from a saved-profile snapshot, with durable progress, preview and download.

## Dependencies

Complete Profile domains and Q10 content/provider/output/retention decisions are required. R1 is not required. Q06/R19 resolve missing summary/achievement/title data or approve omission. Shared job/artifact infrastructure may be reused if R1 exists.

## Product requirements covered

[Resume](../../product/features/resume.md) RES-AC-005–010, PRO-AC-004 when capability enabled. Professional summary, contact, experience, skills, education and certifications must remain grounded; optional future rich editing is not in scope.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Create immutable owner-scoped profile snapshot with content hash and factual source references. Generation/render pipeline permits supported phrasing but rejects or omits claims not traceable to snapshot. Provider response is untrusted, never authoritative profile data. Use one-column print layout; no app cards inside document.

## Database work

Propose resume_generations plus snapshot/artifact/job metadata: owner, captured source identities/timestamps, content hash, provider/template version, status, timestamps, safe error and retention. No rewrite of live profile and no new skill definitions from generated prose. Conditional migrations share R1 infrastructure without duplicate job schemas. Seed synthetic source/preview pairs with identical certification/employer/date facts.

## GraphQL work

Proposed startResumeGeneration(input options/expectedProfileRevision), resumeGeneration(id)/status, preview/download access and regenerate as a new immutable generation. Owner checks on IDs and artifact access, typed durable statuses, rate/resource bounds. Stable missing-data/provider/render/expired errors. No success download URL before accessible artifact exists.

## Backend work

Snapshot in short transaction; external generation outside it; validate grounded structured output; render PDF and persist completion atomically with artifact metadata. Regenerate uses an explicit new snapshot; retries/idempotency avoid duplicate billing/artifacts. Omit unsupported achievements and never substitute the artifact certificate for saved one. Choose storage/provider/rendering only after approved spike.

## Frontend work

Chooser generation path→meaningful milestone progress→completed dialog→focused preview with Back to Profile and download/regenerate. Display snapshot timing, recoverable failure and predictable filename. Application chrome outside print paper; single column and conventional section hierarchy. Preview pagination/Letter/A4/grayscale reviewed.

## Design artifacts

[Processing](../../design/artifacts/resume/processing.html), [complete](../../design/artifacts/resume/complete.html), [generated preview](../../design/artifacts/resume/generated.html), [chooser](../../design/artifacts/profile/resume-tools.html). Layout is reference; current illustrative achievements/certificate are not approved generated facts. Add generation failure/empty-profile/stale-snapshot/expired states.

## Accessibility

Progress live status without false percentage, focus-managed dialogs, keyboard preview/download controls, readable document text structure and contrast. Accessible HTML preview plus reviewed PDF text order; responsive preview does not embed app sidebar in paper.

## Tests

Unit: snapshot/grounding/factual comparison and filename. DB/API: snapshot immutability, owner isolation, retry idempotence. Provider/render integration: hallucinated employer/date/skill/certification rejected; missing fields omitted; failure/retry/expiry. Browser: start→progress→preview→download. PDF render and extracted text order checked for Letter/A4 and long content; no factual regression from fixture preview.

## Observability

Job/status/duration/render errors, safe provider usage/cost if selected; no prompts/full profile/resume text in ordinary logs. Retention and failed-job cleanup monitored using chosen runtime.

## Acceptance criteria

RES-AC-005–010 pass: grounded saved snapshot, real progress, retry/failure, usable preview/download and documented single-column content hierarchy. Missing achievements are never invented. Scope and provider/security decisions approved; no resume editing/recommendation feature silently added.

## Risks

Cannot infer factual accomplishments from job title, stale snapshot mistaken for current profile, provider fabrications, inaccessible PDF reading order and orphaned artifacts/cost from retries.

## Human review checkpoint

Product reviews source-to-generated factual traceability; design reviews print output; security reviews owner access/retention/provider handling; engineering demonstrates failure and hallucination rejection. Release only after separate authorization.
