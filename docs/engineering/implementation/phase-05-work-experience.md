# Phase 05 — Work Experience and first derived sources

Status: **PLANNED**. Implementation: **Not Started**. This document plans work only. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Deliver the first full profile-record vertical slice and prove non-destructive skill-source reconciliation end to end.

## Dependencies

02/03 and catalog/custom interaction from 04A are prerequisites for Work CRUD. Q07/Q08 gate 05A dates/parent selection; 04C's resolved dismissal/Undo contract is required for source integration 05C. Drag slice 04B is not a dependency of saving Work. Introduce Work into onboarding in 05A/05B; source behavior must pass before the whole phase is accepted.

## Product requirements covered

[Work Experience](../../product/features/work-experience.md) EXP-AC-001–011; CAT-AC-001–010 for Company/Job Title; PRO-AC-002/011; SKL-AC-014 first multi-source path.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Experience service coordinates selected catalogs, saved record and Skills source updates in one transaction. Introduce ProfileRecordDialog now with explicit WorkExperienceFields. Company/title provide the next concrete catalog consumers: extract proven lexical/visibility/normalization helpers from the Skills implementation here, without a generic repository. Reviewed deterministic title-to-skill mappings attach automatically on save; no external AI call or candidate review.

## Database work

Add companies, job_titles, scoped company_job_titles, work_experiences and work-experience FK/source-shape extension on user_skill_sources. Company schema/seeds arrive here with the owning record save; they were deliberately absent from 03. Employment enum includes all nine spec values. Current implies null end; ordered approved month/date values. Add user/date ordering and association traversal indexes. Seed 81 companies, 122 titles/678 synthetic links and curated source-skill mapping; all skill-affecting saves acquire the owning user lock; source delete removes only its own links and reconciles remaining sources.

## GraphQL work

viewer.workExperiences plus batched skill previews; searchCompanies(input); searchJobTitles(input query/companySelection/limit); addWorkExperience(input), updateWorkExperience(id,input), removeWorkExperience(id). CatalogSelection for company/title; no userId. Return the canonical record; invalidate/refetch the viewer skill projection after a source-changing success rather than returning the full Skills graph from every domain mutation. Errors for invalid parent/dates, inaccessible ID, conflict, validation and persistence; no partial custom rows.

## Backend work

Validate company/title visibility and approved fallback; create viewer-private association when a fallback requires one, never publish it globally. Date/current validation on server; update mapping/source links atomically, preserve manual proficiency and never clear a dismissal on source save. Repository loads labels/previews in bounded queries. Source deletion uses the approved reversible removal/dismissal pattern.

## Frontend work

Profile embedded records with empty/loading/error/retry, recent-first order, add/edit/remove and expandable skill preview. Explicit Company → hidden Job Title → Employment Type → dates → current. Parent change clears incompatible title and stale search. ProfileRecordDialog handles focus, sticky actions, pending/error preservation and small-screen sheet. Focused surface, if used, has Back to Profile and one Add action.

## Design artifacts

[Experience](../../design/artifacts/experience/experience.html), [empty](../../design/artifacts/experience/experience-empty.html), [add](../../design/artifacts/experience/experience-add.html), [edit](../../design/artifacts/experience/experience-edit.html), [company search/custom](../../design/artifacts/experience/company-custom.html), [title search](../../design/artifacts/experience/job-title-search.html), [employment types](../../design/artifacts/experience/employment-type.html), [dialog baseline](../../design/artifacts/design-system/components/profile-record-dialog.html). Correct custom label examples and add source-delete/error state composition.

## Accessibility

Initial dialog focus, trap, Escape and restoration; label/error associations; hidden child absent from accessibility tree. Current checkbox updates end field without focus loss; menu/remove and preview expansion keyboard-operable. Ensure mobile scrolling never hides Save/errors.

## Tests

Unit: month/current validation and title compatibility. DB: private association ownership, concurrent custom saves, source deletion with MANUAL/other source retention. GraphQL: CRUD/foreign record/private title, rollback on source failure. UI: dependency clearing, retry values, one CTA and preview expansion. Browser: add private company/title from Profile, reload, update/delete and verify Skills retention.

## Observability

Save/delete duration and source-reconciliation counts, sanitized failure/request IDs. Do not log company/custom labels or full employment history.

## Acceptance criteria

EXP-AC-001–011 pass; canceled/failed dialogs leave no custom artifacts; current dates enforced; deleting one source leaves supported skill and its proficiency intact. Query count does not grow per preview chip. Work is manageable from Profile.

## Risks

Global fallback mistaken for a verified company association; long hash/search work inside transactions; deletion race with another source attachment; API date precision diverging from UI.

## Human review checkpoint

Review full catalog/custom form, database constraints and actual source-delete race evidence. Review the minimal dialog and Work-specific reconciliation; refine/extract shared reconciliation with a second real source domain, not as a prerequisite framework for it.
