# Product Requirements Document

## 1. Product summary

Career Profile is a profile-centered application for building and maintaining a structured professional profile. Users manage personal information, work history, education, certifications, professional focus, and skills. Most structured profile fields are backed by searchable catalogs so users can find common values quickly while retaining the ability to add private custom values when the catalog does not contain the right option.

The application also includes simple email/password authentication, lightweight onboarding, and a small administrative area for user management.

## 2. Product goals

1. Give users one coherent place to maintain a structured professional profile.
2. Make profile entry fast through searchable seeded catalogs rather than repetitive free-form typing.
3. Never block users because a catalog is incomplete: eligible catalog fields support viewer-private custom values.
4. Make the Skills experience rich enough to support catalog search, custom skills, proficiency management, and source provenance.
5. Connect experience, education, and certifications to skills without making those relationships destructive or opaque.
6. Provide realistic authentication, onboarding, and administration without expanding into enterprise identity management.
7. Keep UI behavior consistent through shared accessible search/select and dialog primitives.
8. Keep the product modular enough that recommendations, assessments, and richer classification can be added later.

## 3. Roles

### USER

A regular user can register, sign in/out, complete onboarding, manage their own profile, and import or generate their own resumes.

### ADMIN

An administrator has normal user capabilities and can additionally view a basic user list and create `USER` or `ADMIN` accounts.

The initial product does not include tenant roles, impersonation, suspension, account deletion, or complex RBAC.

## 4. Initial release scope

Detailed requirements live in feature specifications:

- [Authentication](features/authentication.md)
- [Onboarding](features/onboarding.md)
- [Profile workspace](features/profile-shell-overview.md)
- [Account · Profile and Settings](features/personal-information.md)
- [Shared catalog-backed selectors](features/catalog-backed-selectors.md)
- [Shared data tables](features/data-tables.md)
- [Work experience](features/work-experience.md)
- [Education](features/education.md)
- [Certifications](features/certifications.md)
- [Professional Focus](features/professional-focus.md)
- [Skills](features/skills.md)
- [Admin user management](features/admin-users.md)
- [Resume import and generation](features/resume.md)


## 5. Profile catalog strategy

Common values should come from global seed catalogs whenever practical. The initial catalogs cover:

- skills;
- companies;
- job titles and company/title associations;
- educational institutions;
- majors/specializations;
- degree types and institution/program offerings;
- certification boards/issuers;
- certifications/exams offered by each board;
- professional focus areas.

Catalog-backed selectors share the same interaction contract: server-side ranked search, debouncing, stale-response protection, keyboard interaction, explicit loading/no-results/error states, and a `Create custom` path where the feature permits it.

Custom values are private to the user who created them. Search results may include global catalog values plus the current viewer's own custom values, but never another user's custom values.

## 6. Dependent profile fields

Some fields only become meaningful after a parent value is chosen. Child controls are hidden until their parent has a selection, not merely disabled placeholders.

Initial dependencies:

```text
Work experience
Company → Job Title

Education
Institution → Major / Specialization → Degree Type

Certification
Certification Board → Certification / Exam
```

Changing/clearing a parent invalidates and clears incompatible child selections.

## 7. Skills

Skills are split into `TECHNICAL` and `FOUNDATIONAL` categories and `BEGINNER`, `INTERMEDIATE`, and `ADVANCED` proficiency. A skill definition is either catalog-backed or custom; a user's skill can have multiple provenance sources such as manual entry, work experience, education, or certification.

New manually added skills default to `INTERMEDIATE`. Editable and onboarding-selected skill chips expose a functional `×` remove control; drag-and-drop remains the required proficiency-reorganization interaction in the editor.

## 8. Data ownership and privacy

Self-service mutations act on the authenticated viewer. Custom catalog entities are viewer-private. Admin capabilities do not implicitly make private catalog values visible unless a future explicit admin requirement says so.

## 9. Shared UX expectations

All major data-driven surfaces define loading, empty, populated, error/retry, and save-in-progress states. Product tables additionally require server-backed pagination, appropriate filters, sorting, and search where applicable. Search/select components are keyboard accessible. Parent/child dependencies are obvious. Dialogs share a common shell and action model while retaining domain-specific fields.

## 10. Deferred scope

Not in the initial release:

- email verification, MFA, SSO, self-service forgot-password/email-recovery;
- job applications/search;
- assessment engine;
- recommendation engine;
- organizations/tenants;
- production-grade external taxonomy synchronization.

## Application shell shortcuts

Authenticated desktop navigation includes required keyboard accelerators. `Cmd+B` / `Ctrl+B` toggles the sidebar, while `Cmd+K` / `Ctrl+K` opens a permission-aware command palette for navigation and relevant Profile actions. Shortcuts supplement, rather than replace, visible controls and follow the focus/modal rules in the Application Shell feature specification.
