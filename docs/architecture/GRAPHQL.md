# GraphQL Surface

The schema below is a planning contract, not final SDL. Naming may evolve during implementation while preserving product semantics.

## Viewer

`viewer` returns the authenticated user or `null` when unauthenticated. Self-service mutations derive ownership from session context rather than accepting arbitrary user IDs.

## Shared catalog selection input

Catalog-backed forms conceptually pass either a known catalog ID or a local custom label. Exactly one is set:

```graphql
input CatalogSelectionInput {
  catalogId: ID
  customLabel: String
}
```

Validation enforces the one-of rule at the API/application boundary. Custom definitions are created transactionally with the owning record where practical.

## Catalog search

All search operations use the same semantics but domain-specific input/result types:

```graphql
searchCompanies(input: CatalogSearchInput!): [CompanyOption!]!
searchJobTitles(input: JobTitleSearchInput!): [JobTitleOption!]!

searchInstitutions(input: CatalogSearchInput!): [InstitutionOption!]!
searchMajors(input: MajorSearchInput!): [MajorOption!]!
searchDegreeTypes(input: DegreeTypeSearchInput!): [DegreeTypeOption!]!

searchCertificationBoards(input: CatalogSearchInput!): [CertificationBoardOption!]!
searchCertifications(input: CertificationSearchInput!): [CertificationOption!]!

searchFocusAreas(input: CatalogSearchInput!): [FocusAreaOption!]!
searchSkills(input: SkillSearchInput!): [SkillSearchResult!]!
```

Parent-dependent search inputs carry the selected known parent ID when available and enough context for custom-parent fallback behavior.

## Profile collections

### Work Experience

```graphql
viewer { workExperiences { ... } }
addWorkExperience(input: WorkExperienceInput!): WorkExperience!
updateWorkExperience(id: ID!, input: WorkExperienceInput!): WorkExperience!
removeWorkExperience(id: ID!): RemovePayload!
```

`WorkExperienceInput` uses `company: CatalogSelectionInput!` and `jobTitle: CatalogSelectionInput!` plus employment/date fields.

### Education

```graphql
viewer { education { ... } }
addEducation(input: EducationInput!): EducationExperience!
updateEducation(id: ID!, input: EducationInput!): EducationExperience!
removeEducation(id: ID!): RemovePayload!
```

`EducationInput` uses `institution`, `majorSpecialization`, and `degreeType` selections. Expose the selection as `majorSpecialization`.

### Certifications

```graphql
viewer { certifications { ... } }
addCertification(input: CertificationInput!): Certification!
updateCertification(id: ID!, input: CertificationInput!): Certification!
removeCertification(id: ID!): RemovePayload!
```

Input uses `certificationBoard` + `certification` catalog selections.

### Professional Focus

```graphql
viewer { professionalFocus { focusArea { ... } sortOrder isPrimary } }
updateProfessionalFocus(input: ProfessionalFocusInput!): [UserFocusArea!]!
```

No fixed top-five limit exists.

## Skills

```graphql
viewer { skills { id proficiency skill { id label category origin } sources { type referenceId } } }
addSkill(input: AddSkillInput!): UserSkill!
addCustomSkill(input: AddCustomSkillInput!): UserSkill!
removeSkill(id: ID!): RemovePayload!
updateSkillProficiency(id: ID!, proficiency: SkillProficiency!): UserSkill!
```

## Errors

Expose stable application codes through `extensions.code`; never leak database internals. Catalog-related examples include `CATALOG_VALUE_NOT_VISIBLE`, `DUPLICATE_CUSTOM_VALUE`, `INVALID_PARENT_SELECTION`, and domain-specific validation errors.

## Admin user management

```graphql
adminUsers(input: AdminUserListInput!): AdminUserConnection!
adminCreateUser(input: AdminCreateUserInput!): User!
adminResetPassword(userId: ID!): AdminResetPasswordPayload!
setPassword(input: SetPasswordInput!): AuthPayload!
```

`AdminUserListInput` carries pagination (`page`/`pageSize` or cursor equivalent), name/email search, role filter, onboarding filter, and sort field/direction. The connection exposes rows plus total/pagination metadata. `adminCreateUser` accepts no password.

Authentication must represent first-password/reset-password setup as an explicit typed outcome/error code such as `PASSWORD_SETUP_REQUIRED`; clients must not infer this state from onboarding alone.
