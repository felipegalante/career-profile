# Domain Model

## User / Profile

`User` owns authentication/authorization identity. `UserProfile` stores editable personal/career context. Profile collections are separate entities rather than one giant profile document.

## WorkExperience

A user-owned employment record referencing a Company selection and Job Title selection plus employment type/dates. Company and Job Title may resolve to global catalog entries or viewer-private custom entries.

## EducationExperience

A user-owned education record referencing Institution, Major / Specialization, and Degree Type selections plus status/years. The application model intentionally uses **Major / Specialization**, uses `majorSpecialization` consistently.

## Certification

A user-owned certification record referencing a Certification Board and Certification / Exam selection plus optional URL/ID and issue/expiration dates.

## ProfessionalFocus

An ordered user selection of FocusArea definitions. At most one selected item may be primary. Focus areas can be global or viewer-private custom definitions.

## Catalog-backed entities

The product contains domain-specific catalogs rather than one polymorphic mega-table:

- `Company`
- `JobTitle`
- `Institution`
- `MajorSpecialization`
- `DegreeType`
- `CertificationBoard`
- `CertificationDefinition`
- `FocusArea`
- `Skill`

Catalog entities share concepts such as normalized labels, global/user scope, owner for custom values, and search behavior, but preserve domain-specific tables/relationships for referential integrity.

## Catalog relationships

- `CompanyJobTitle`: known title association for a company.
- `InstitutionProgram`: Institution + Major / Specialization + Degree Type offering.
- `CertificationDefinition.boardId`: certification/exam belongs to a board.

These relationships drive dependent selectors; they are not frontend hard-coded lists.

## Skill / UserSkill

`Skill` is a reusable definition categorized as `TECHNICAL` or `FOUNDATIONAL`, with definition origin `CATALOG` or `CUSTOM`.

`UserSkill` is the user's relationship to a Skill and stores proficiency (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`).

`UserSkillSource` stores one or more provenance links such as `MANUAL`, `WORK_EXPERIENCE`, `EDUCATION`, `CERTIFICATION`, with future sources possible.

## Important invariants

1. Emails are normalized and unique.
2. Public registration cannot choose `ADMIN`.
3. Viewer-private custom catalog values are never visible to other users.
4. Global normalized catalog labels are unique within the relevant domain/parent scope where practical.
5. Viewer custom normalized labels are unique for that viewer/domain/parent scope.
6. One `UserSkill` exists per user + skill definition.
7. Skill provenance is separate from skill definition origin.
8. New manually added skills default to `INTERMEDIATE`.
9. Current employment/education cannot have an end date/year.
10. Certification expiration cannot precede issue date.
11. Education stores the selected Major / Specialization through `majorSpecialization`.
12. Dependent selectors require their parent selections and clear incompatible children when a parent changes.
