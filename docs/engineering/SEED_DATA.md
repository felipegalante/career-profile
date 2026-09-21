# Seed Data Plan

Seeds exist to make local development and the profile-search UX realistic. They are representative development fixtures, not authoritative production taxonomies.

## Accounts/profile fixtures

Seed at least:

- one ADMIN;
- one complete regular profile with multiple experiences/education/certifications/focus/skills;
- one lighter regular profile;
- one onboarding-incomplete user.

## Skills

Maintain a large 1,000–3,000+ global catalog across Technical and Foundational categories with similar names, acronyms, punctuation, and long labels to exercise ranking/fuzzy search.

## Companies

Seed ~75–150 representative companies across multiple industries. Include normalized name and optional industry/country metadata.

## Job titles

Seed ~100–200 common titles. Seed company/title associations so selected companies can surface relevant titles before global fallback results.

## Education

Seed:

- ~50–100 institutions;
- a broad Major / Specialization vocabulary;
- global degree types;
- hundreds of `InstitutionProgram` combinations linking institution + major/specialization + degree type.

Search is driven by these relationships, not frontend arrays.

## Certifications

Seed ~15–30 certification boards/issuers and a substantial set of their offered certifications/exams. Each certification definition references its board.

## Professional Focus

Seed ~15–30 broad focus areas with descriptions. There is no top-five rule.

## Custom values

Profile fixtures should include at least one viewer-private custom value in several catalogs to validate visibility/isolation and mixed global/custom rendering.
