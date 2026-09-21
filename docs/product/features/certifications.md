# Feature: Certifications

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**
- Surface: managed from `/profile` through embedded section + dialogs

## Purpose

Capture professional certifications and exams using board/issuer-aware catalog selection while preserving a custom fallback for incomplete catalogs.

## Field order and dependency

1. **Certification Board***
2. **Certification / Exam*** — hidden until Certification Board is selected
3. Certification URL
4. Certification ID
5. Issue Date
6. Expiration Date

## Certification Board selector

- Search a global catalog of certification boards/issuers plus the viewer's private custom boards.
- Examples in seed data include major cloud, security, project-management, networking, and platform certification organizations.
- If the board is missing, offer private custom creation.

## Certification / Exam selector

- Hidden until Certification Board is selected.
- For a known board, only/primarily show exams/certifications offered by that board.
- Search uses the shared ranking/fuzzy behavior.
- If the desired certification/exam is missing, allow private custom creation under the selected board.
- Changing Certification Board clears an incompatible Certification / Exam.

## Rules

- Certification Board is required.
- Certification / Exam is required.
- Certification URL, when present, must be a valid URL.
- Expiration date cannot precede issue date.
- Certifications automatically contribute reviewed deterministic skill mappings through the standard provenance model; saving does not require per-skill confirmation. A dismissed inferred skill remains hidden until the user re-adds it, even when its certification source is edited.

## UI

Education and Certifications are independent sections embedded on `/profile`, each with add/edit dialogs. The dialog uses the shared `ProfileRecordDialog` shell and `CatalogCombobox`.

## Planned GraphQL

- `viewer.certifications`
- `searchCertificationBoards(input)`
- `searchCertifications(input: { query, boardSelection, limit })`
- `addCertification(input)`
- `updateCertification(id, input)`
- `removeCertification(id)`

## Acceptance criteria

- **CERT-AC-001:** Certification Board is required and appears before Certification / Exam.
- **CERT-AC-002:** Certification / Exam is hidden until a board is selected.
- **CERT-AC-003:** Board and certification selectors support global catalog values plus viewer-private custom values.
- **CERT-AC-004:** A known board scopes/prioritizes its offered certifications/exams.
- **CERT-AC-005:** Changing the board clears an incompatible certification selection.
- **CERT-AC-006:** Invalid URL and expiration-before-issue are rejected.
- **CERT-AC-007:** User can view, edit, and remove only their own certifications.
- **CERT-AC-008:** Certification-derived skills use the standard provenance model and survive source deletion when another source remains.
