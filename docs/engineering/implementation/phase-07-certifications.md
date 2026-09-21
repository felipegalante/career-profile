# Phase 07 — Certifications and board catalogs

Status: **PLANNED**. Implementation: **Not Started**. This document plans work only. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Complete certification records, issuer-scoped definitions and source-safe Skills integration.

## Dependencies

02/03 and the existing catalog/custom interaction are prerequisites; Q07/Q08 close only the relevant date/parent rules, while 04C's resolved dismissal/Undo contract applies to derived integration. Work is the default earlier implementation, not a product or schema dependency. Reuse its dialog/helpers when available; if this domain is scheduled first, implement only its concrete needs and extract on the second consumer. Full multi-domain provenance evidence remains a release gate.

## Product requirements covered

[Certifications](../../product/features/certifications.md) CERT-AC-001–008; CAT-AC-001–010 for board/exam; PRO-AC-002/011 and SKL-AC-014 all initial source types.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Certification record and CertificationDefinition are distinct domain types. Certification service coordinates board/custom definition resolution, record persistence and Skills links in one transaction. Preserve term Certifications in UI and contracts.

## Database work

Create certification_boards, certification_definitions, certifications with scoped/owner uniqueness and explicit board/definition consistency via composite FK or derived board. External certification ID is optional metadata. Ordered issue/expiration month/date values and timestamps. Add typed certification source FK/check/unique index. Seed 20 boards/84 definitions and reviewed deterministic mappings that attach automatically on source save; tests include same exam name under two boards and private board/exam pairs.

## GraphQL work

viewer.certifications; searchCertificationBoards; searchCertifications(input boardSelection/query/limit); add/update/removeCertification. Inputs contain selected board and definition, optional URL/external ID/dates. Errors for board mismatch, invisible values, bad URL/date/conflict. Return canonical record; invalidate/refetch Skills after source changes; no arbitrary user or provenance ID.

## Backend work

Authorize both parent and child, including custom board drafts. Strictly scoped definition search under approved Q08, custom exam under selected board, clear invalid relationships on changes. Accept http(s) URLs only, reject unsafe schemes. Source update/delete uses transaction and remaining-source check; no remote URL fetching required to validate syntax.

## Frontend work

Independent Profile section, board-first form, hidden Certification / Exam, URL/ID/issue/expiry fields on both add and edit. Loading/empty/error/retry, saving state and visible skill preview where present. Reuse dialog and catalog behavior; add-date omission in artifact is corrected, not copied. Mobile fields stack; focus surface shows Back to Profile.

## Design artifacts

[Empty](../../design/artifacts/certifications/certifications-empty.html), [add](../../design/artifacts/certifications/certification-add.html), [edit](../../design/artifacts/certifications/certification-edit.html), [board search](../../design/artifacts/certifications/board-search.html), [exam search](../../design/artifacts/certifications/exam-search.html), shared form states. Complete private board/exam and invalid selection examples before acceptance.

## Accessibility

Label exam/board separately; expose hidden/revealed states without focus jumps; URL/date errors associated and announced. Keyboard/touch dialog save/close and source-delete recovery follow shared baseline; action names include record context.

## Tests

Unit: URL and ordered dates. DB: board mismatch constraint, global/private parent invariants, duplicate concurrent custom exam and source count. GraphQL: foreign-owner record/exam rejection and atomic rollback. UI: parent change/reset, all fields in add/edit and retry. Browser: save/reload/edit/delete with skill simultaneously backed by manual/work/education.

## Observability

Board-filter query duration, safe validation/conflict codes, source reconciliation totals. No credential IDs/URLs in logs; audit only required operational metadata.

## Acceptance criteria

CERT-AC-001–008 pass; wrong-board exam cannot be saved even with forged input; optional ID/URL/date semantics correct; source removal preserves other provenance. Full initial multi-source Skills behavior now demonstrated with actual domain records.

## Risks

Duplicate field naming certification ID vs definition ID, permitting unrelated global exam fallback, custom board ownership and date precision drift.

## Human review checkpoint

Review database-enforced board agreement, custom parent flow and combined-source deletion matrix. Confirm full Profile record functionality and remaining design gaps before onboarding integration.
