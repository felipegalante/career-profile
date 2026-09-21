# Design Artifacts

Browsable review pages:

- [`artifacts/index.html`](artifacts/index.html) — individual artifact index
- [`artifacts/all-pages.html`](artifacts/all-pages.html) — all pages/states grouped by domain

Work Experience, Skills, Education, and Certifications are Profile section/dialog states, not separate primary navigation destinations.

## Design system

- [Color](artifacts/design-system/color/color.html)
- [Admin table](artifacts/design-system/components/admin-table.html)
- [Catalog combobox](artifacts/design-system/components/catalog-combobox.html)
- [Command palette](artifacts/design-system/components/command-palette.html)
- [Profile record dialog](artifacts/design-system/components/profile-record-dialog.html)
- [Profile records](artifacts/design-system/components/profile-records.html)
- [Skill components](artifacts/design-system/components/skills.html)
- [Design system overview](artifacts/design-system/overview/overview.html)
- [Design principles](artifacts/design-system/overview/principles.html)
- [Catalog and custom values](artifacts/design-system/patterns/catalog-custom-values.html)
- [Dependent fields](artifacts/design-system/patterns/dependent-fields.html)
- [Actions and inputs](artifacts/design-system/primitives/actions-inputs.html)
- [Feedback and disclosure](artifacts/design-system/primitives/feedback.html)
- [Overlays](artifacts/design-system/primitives/overlays.html)
- [Mobile shell](artifacts/design-system/shell/mobile.html)
- [Application shell](artifacts/design-system/shell/sidebar.html)
- [Keyboard shortcuts](artifacts/design-system/shell/keyboard-shortcuts.html)
- [Collection states](artifacts/design-system/states/collection-states.html)
- [Form states](artifacts/design-system/states/form-states.html)
- [Type and layout](artifacts/design-system/type-layout/type-layout.html)

## Flows

- [Admin flow](artifacts/_overview/admin-flow.html)
- [Authentication and onboarding](artifacts/_overview/auth-onboarding-flow.html)
- [Catalog selection](artifacts/_overview/catalog-selection-flow.html)
- [Product map](artifacts/_overview/product-map.html)
- [Profile management](artifacts/_overview/profile-management-flow.html)
- [Resume flow](artifacts/_overview/resume-flow.html)
- [Skills flow](artifacts/_overview/skills-flow.html)

## Authentication

- [Sign in error](artifacts/auth/login-error.html)
- [Sign in](artifacts/auth/login.html)
- [Registration validation](artifacts/auth/register-errors.html)
- [Register](artifacts/auth/register.html)
- [Set password](artifacts/auth/set-password.html)

## Onboarding

- [Onboarding basics](artifacts/onboarding/basics.html)
- [Onboarding career context](artifacts/onboarding/career.html)
- [Onboarding professional focus](artifacts/onboarding/focus.html)
- [Onboarding skills](artifacts/onboarding/skills.html)

## Profile

- [Profile empty](artifacts/profile/overview-empty.html)
- [Profile mobile](artifacts/profile/overview-mobile.html)
- [Profile](artifacts/profile/profile.html)
- [Profile · Resume tools](artifacts/profile/resume-tools.html)
- [Account menu](artifacts/profile/avatar-menu.html)
- [Account · Profile tab](artifacts/profile/account.html)
- [Account · Settings tab](artifacts/profile/account-settings.html)
- [Account · Edit profile information](artifacts/profile/personal-edit.html)

## Work Experience

- [Create custom company](artifacts/experience/company-custom.html)
- [Company search](artifacts/experience/company-search.html)
- [Employment type selector](artifacts/experience/employment-type.html)
- [Add work experience](artifacts/experience/experience-add.html)
- [Edit work experience](artifacts/experience/experience-edit.html)
- [Work experience empty](artifacts/experience/experience-empty.html)
- [Work experience · Profile section state](artifacts/experience/experience.html)
- [Job title search](artifacts/experience/job-title-search.html)

## Education

- [Degree type search](artifacts/education/degree-search.html)
- [Add education](artifacts/education/education-add.html)
- [Education and certifications · Profile section state](artifacts/education/education-certifications.html)
- [Edit education](artifacts/education/education-edit.html)
- [Education empty](artifacts/education/education-empty.html)
- [Create custom institution](artifacts/education/institution-custom.html)
- [Institution search](artifacts/education/institution-search.html)
- [Major specialization search](artifacts/education/major-search.html)

## Certifications

- [Certification board search](artifacts/certifications/board-search.html)
- [Add certification](artifacts/certifications/certification-add.html)
- [Edit certification](artifacts/certifications/certification-edit.html)
- [Certifications empty](artifacts/certifications/certifications-empty.html)
- [Certification exam search](artifacts/certifications/exam-search.html)

## Professional Focus

- [Edit professional focus](artifacts/focus/focus-edit.html)
- [Professional focus empty](artifacts/focus/focus-empty.html)
- [Professional focus search](artifacts/focus/focus-search.html)
- [Professional focus](artifacts/focus/focus.html)

## Skills

- [Create custom skill](artifacts/skills/skills-custom.html)
- [Edit skills](artifacts/skills/skills-edit.html)
- [Skills expanded](artifacts/skills/skills-expanded.html)
- [Skill feedback](artifacts/skills/skills-feedback.html)
- [Skills mobile](artifacts/skills/skills-mobile.html)
- [Skill search](artifacts/skills/skills-search.html)
- [Skills · Profile section state](artifacts/skills/skills.html)

## Admin

- [Admin create user](artifacts/admin/users-create.html)
- [Admin users](artifacts/admin/users.html)
- [Admin reset password](artifacts/admin/users-reset-password.html)

## Resume

- [Resume generation complete](artifacts/resume/complete.html)
- [Generated resume preview](artifacts/resume/generated.html)
- [Resume processing](artifacts/resume/processing.html)
- [Resume upload](artifacts/resume/upload.html)


The Resume domain includes a generated resume preview artifact that defines the initial print/PDF layout.


## Interactive requirements represented in artifacts

- Desktop onboarding reuses the authentication split layout and keeps the `Connect the parts of your professional story.` illustration in the right panel across steps.
- Skills edit artifacts support required same-category drag-and-drop.
- Skill-chip `×` controls are functional removal actions in the interactive Skills editor and onboarding Skills artifact, with accessible labels and count reconciliation where applicable.

- Application-shell artifacts demonstrate required `Cmd/Ctrl+B` sidebar toggling and `Cmd/Ctrl+K` command-palette behavior.
