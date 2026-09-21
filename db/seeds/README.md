# Development Seeds

These fixtures provide realistic local search/profile data; they are not production taxonomies.

- `global-skills.csv`: large Technical/Foundational skill catalog.
- `companies.seed.json`: global company catalog.
- `job-titles.seed.json`: global job-title vocabulary.
- `company-job-titles.seed.json`: known company/title associations used for relevance ranking.
- `institutions.seed.json`: institution catalog.
- `majors-specializations.seed.json`: global Major / Specialization vocabulary.
- `degree-types.seed.json`: global degree-type vocabulary.
- `institution-programs.seed.json`: Institution → Major / Specialization → Degree Type offerings.
- `certification-boards.seed.json`: certification boards/issuers.
- `certifications.seed.json`: board-specific certifications/exams.
- `focus-areas.seed.json`: Professional Focus catalog.
- `users.seed.json`: seeded regular/admin accounts.
- `profile-fixtures.seed.json`: representative profile compositions and custom-value examples.

Seed loading should resolve `seedKey` references to generated database IDs and be idempotent or clearly reset/rebuild local development data.
