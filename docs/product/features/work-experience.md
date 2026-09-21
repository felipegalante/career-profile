# Feature: Work Experience

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**
- Surface: managed from `/profile` through embedded section + dialogs

## Purpose

Let users maintain employment history with high-quality catalog-assisted data entry and connect relevant skills to individual experiences.

## Field order

1. **Company***
2. **Job Title*** — hidden until Company is selected
3. Employment Type
4. Start Date
5. End Date
6. Currently work here

Company and Job Title use the shared catalog-backed selector behavior.

## Company selector

- Search the seeded company catalog using standard ranking/fuzzy behavior.
- Search also includes the viewer's private custom companies.
- If no appropriate result exists, offer `Create custom company "…"`.
- A custom company is visible only to its creator.
- Selecting or creating a company reveals Job Title.

## Job Title selector

- Hidden until Company has a selection.
- For known companies, titles known to be associated with that company rank first.
- The broader global job-title vocabulary may be used as fallback suggestions after company-specific results.
- Viewer-private custom titles also participate when valid for the selected company.
- If no appropriate title exists, offer private custom creation.
- Changing Company clears Job Title unless the current title remains explicitly valid for the new company.

## Employment types

- Full-time
- Part-time
- Self-employed
- Contract
- Internship / Co-op
- Apprenticeship
- Seasonal / Summer
- Volunteer
- Other

## Date rules

- `isCurrent = true` implies no end date;
- setting current clears/hides or disables end date;
- end date cannot precede start date.

## Experience card

Each saved record shows company, job title, employment type, date range/current state, a preview of associated/derived skills, and edit/remove actions. Skill preview can expand when truncated.

## Skill relationship

A work experience automatically contributes its reviewed deterministic skill mappings to the user's Skills profile through `UserSkillSource` relationships; saving does not ask the user to confirm each mapped skill. Removing an experience removes only provenance links for that source. A dismissed inferred skill stays hidden even if this experience is later edited, while a skill remains visible when another active source still contributes it.

## Shared components

Use the standard `ProfileRecordDialog` shell and `CatalogCombobox` for Company/Job Title. Do not create feature-specific search mechanics.

## Planned GraphQL

- `viewer.workExperiences`
- `searchCompanies(input)`
- `searchJobTitles(input: { query, companySelection, limit })`
- `addWorkExperience(input)`
- `updateWorkExperience(id, input)`
- `removeWorkExperience(id)`

Company/Job Title inputs accept either a known catalog reference or a custom label, resolved transactionally during save.

## Acceptance criteria

- **EXP-AC-001:** Company is required and appears before Job Title.
- **EXP-AC-002:** Job Title is not rendered until a Company selection exists.
- **EXP-AC-003:** User can select a catalog company or enter a viewer-private custom company.
- **EXP-AC-004:** Job-title search prefers titles related to the selected company and supports broader fallback/custom entry.
- **EXP-AC-005:** Changing Company clears an incompatible Job Title.
- **EXP-AC-006:** Employment type supports the documented values.
- **EXP-AC-007:** Current experience removes the end-date requirement and displays as current.
- **EXP-AC-008:** End date before start date is rejected.
- **EXP-AC-009:** User can view, edit, and remove only their own experiences.
- **EXP-AC-010:** Experience cards show associated skills when present and can expand a truncated preview.
- **EXP-AC-011:** Removing an experience does not remove a user skill that has another active source.
