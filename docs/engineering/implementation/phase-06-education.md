# Phase 06 — Education and program catalogs

Status: **PLANNED**. Implementation: **Not Started**. This document plans work only. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Implement education records with institution/program-aware selection and safe education skill sources.

## Dependencies

02/03 and the existing catalog/custom interaction are prerequisites; Q07/Q08 close only the relevant date/parent rules, while 04C's resolved dismissal/Undo contract applies to derived integration. Work is the default earlier implementation, not a product or schema dependency. Reuse its dialog/helpers when available; if this domain is scheduled first, implement only its concrete needs and extract on the second consumer. Full multi-domain provenance evidence remains a release gate.

## Product requirements covered

[Education](../../product/features/education.md) EDU-AC-001–009; CAT-AC-001–010 for three education selectors; PRO-AC-002/011; SKL-AC-014 combined sources.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Education module owns explicit fields/services/repositories. Reuse combobox/dialog mechanics and Skills transaction boundary; no separate onboarding store and no hardcoded frontend program lists.

## Database work

Create institutions, majors_specializations, degree_types, scoped institution_programs and education_experiences. All FK/owner/unique/triple invariants from data contracts; integer start/end years, current no end, status compatibility; timestamps. Add education source FK/check/unique index. Seed 60 institutions, 77 majors, 17 degrees and reviewed/synthetic-labeled 1,260 relations; small diverse test offerings. Save selection resolution/program association/record/provenance atomically, automatically attaching reviewed mappings without clearing existing dismissals.

## GraphQL work

viewer.education; searchInstitutions, searchMajors(institutionSelection), searchDegreeTypes(institutionSelection,majorSelection). add/update/removeEducation with `majorSpecialization` consistently. Typed status/year/current inputs, canonical resolved selections and stable parent/date/ownership errors. On successful source-changing saves, the client invalidates/refetches Skills. Parent IDs checked before lookup.

## Backend work

Validate required institution/major/degree and approved fallback triple; private relation cannot become global. Reconcile derived sources on edit and delete while preserving other active sources. Enforce ownership on all nested selections and records. Batch program labels and skill previews, avoid per-record catalog fetches.

## Frontend work

Embedded Education section and explicit form: Institution then reveal Major / Specialization then Degree Type, status/years/current-study. Clearing either parent clears incompatible descendants and in-flight results. Include current checkbox missing from artifacts. Save/cancel/pending/errors and loading/empty views; mobile one-column dialog; Back to Profile when focused.

## Design artifacts

[Education add](../../design/artifacts/education/education-add.html), [edit](../../design/artifacts/education/education-edit.html), [empty](../../design/artifacts/education/education-empty.html), [institution search](../../design/artifacts/education/institution-search.html), [custom](../../design/artifacts/education/institution-custom.html), [major](../../design/artifacts/education/major-search.html), [degree](../../design/artifacts/education/degree-search.html), [records](../../design/artifacts/education/education-certifications.html). Add current-study control and custom-major/degree/error variants; remove implementation hints from hidden controls.

## Accessibility

Programmatic labels in exact hierarchy, no disabled ghost descendants, predictable focus when a parent clears fields, announced validation and retained drafts. Dialog/combobox Escape ordering and keyboard-only triple selection; long labels wrap and mobile footer stays reachable.

## Tests

Unit: year/status rules and parent compatibility. DB: scoped triple uniqueness, mismatched/cross-user program rejection and source retention. GraphQL: all custom/global parent combinations and concurrent duplicate triple. UI: hidden fields, parent reset, current state and retry input preservation. Browser: institution→major→degree save/reload, edit parent and delete education supported skill while work/manual source remains.

## Observability

Safe error/parent-invalid counts, query duration and source link changes; no education/DOB payload logging. EXPLAIN institution+major queries on full seed volume.

## Acceptance criteria

EDU-AC-001–009 pass. All three selectors have custom paths, term/model is Major / Specialization, current clears end, incompatible values cannot persist, and deleting education does not remove a skill backed elsewhere.

## Risks

Synthetic offerings presented as factual, private triples leaking through a global major, contradictory current/status, stale degree query after institution switch.

## Human review checkpoint

Product checks status/date and fallback semantics; design reviews full three-level keyboard/mobile form; engineering reviews program uniqueness and shared-source deletion evidence.
