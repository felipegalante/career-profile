# Feature Specifications

Each file in this directory owns product behavior for one domain area or reusable product capability.

A feature spec should include product/implementation status, goals, states, data/business rules, planned integration, failure behavior, and stable acceptance criteria.

Initial specs:

- Application shell & keyboard shortcuts
- Authentication
- Onboarding
- Profile workspace
- Account · Profile/Settings
- Catalog-backed selectors (cross-cutting)
- Work Experience
- Education
- Certifications
- Professional Focus
- Skills
- Admin users
- Resume import and generation

Product choices belong here unless they materially determine technical architecture. Technical architecture choices belong in ADRs.

- [`data-tables.md`](data-tables.md) — shared pagination/filter/sort/search requirements for tables.
