# Feature: Education

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**
- Surface: managed from `/profile` through embedded section + dialogs

## Purpose

Capture formal education history with institution-aware program selection and allow education records to contribute relevant profile skills.

## Field order and dependency

1. **Institution***
2. **Major / Specialization*** — hidden until Institution is selected
3. **Degree Type*** — hidden until Major / Specialization is selected
4. Status
5. Start Year
6. End Year
7. Currently study here

The product/model terminology is **Major / Specialization**, represented by `majorSpecialization` in application contracts and a `major_specialization_id` reference in persistence.

## Institution selector

- Search the global seeded institution catalog plus viewer-private custom institutions.
- Standard catalog ranking/fuzzy/custom behavior applies.
- If no appropriate institution exists, allow private custom institution creation.

## Major / Specialization selector

- Hidden until Institution is selected.
- For a known institution, search majors/specializations offered by that institution.
- If curated offerings are unavailable or insufficient, the selector may fall back to the global major/specialization vocabulary, while clearly distinguishing known offerings where useful.
- Private custom Major / Specialization values are allowed.
- Changing Institution clears an incompatible Major / Specialization and Degree Type.

## Degree Type selector

- Hidden until Major / Specialization is selected.
- For known Institution + Major combinations, show degree types from seeded program offerings first.
- Global degree types can be fallback choices when no curated program relation exists.
- Private custom Degree Type values are allowed for catalog gaps.
- Changing Major / Specialization clears an incompatible Degree Type.

## Statuses

- In progress
- Completed
- Paused
- Withdrawn

## Date/year rules

- current education has no end year;
- end year cannot precede start year.

## Data relationship

Known program availability is modeled through Institution → Major / Specialization → Degree Type offerings rather than hard-coding dropdown options in the frontend.

Reviewed deterministic skill mappings attach automatically when an education record is saved; there is no per-skill confirmation step. A dismissed inferred skill remains hidden until the user re-adds it, even when its education source is edited.

## UI

Education and Certifications are independent sections embedded on `/profile`. Education uses the shared profile-record dialog baseline and shared catalog selector.

## Planned GraphQL

- `viewer.education`
- `searchInstitutions(input)`
- `searchMajors(input: { query, institutionSelection, limit })`
- `searchDegreeTypes(input: { query, institutionSelection, majorSelection, limit })`
- `addEducation(input)`
- `updateEducation(id, input)`
- `removeEducation(id)`

## Acceptance criteria

- **EDU-AC-001:** Institution is required and is the first education field.
- **EDU-AC-002:** Major / Specialization is required and hidden until Institution is selected.
- **EDU-AC-003:** Degree Type is required and hidden until Major / Specialization is selected.
- **EDU-AC-004:** Institution, Major / Specialization, and Degree Type support catalog search and private custom values.
- **EDU-AC-005:** Known Institution/Major relationships prioritize relevant degree offerings.
- **EDU-AC-006:** Changing a parent selection clears incompatible dependent selections.
- **EDU-AC-007:** Current-study state clears the end year; end year before start year is rejected.
- **EDU-AC-008:** User can view, edit, and remove only their own education records.
- **EDU-AC-009:** Education-derived skills use the standard provenance model and survive source deletion when another source remains.
