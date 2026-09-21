# ADR 0004: Profile-centered domain modules

- Status: Accepted

## Context

Personal profile data, work experience, education, certifications, professional focus, and skills have independent behavior but meaningful cross-domain relationships, especially catalog selection and skill provenance.

## Decision

Structure backend application/domain code around explicit modules for Account/Auth, Profile, Experience, Education, Certifications, Professional Focus, Skills, Catalog Search, and Admin while treating them as parts of one profile-centered modular monolith.

## Consequences

- each module owns domain rules/repositories;
- cross-domain workflows use explicit services rather than resolver-to-resolver calls;
- shared infrastructure (catalog search, sessions, database) is reusable without collapsing domains into generic tables.
