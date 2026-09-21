# Seed data audit

Status: **CONFIRMED observations; PLANNED remediation**. All source rows were parsed and checked; no loader/database seed run exists yet.

| Dataset | Rows | Assessment |
| --- | ---: | --- |
| Skills | 1,546 | Within target; 1,422 TECHNICAL and 124 FOUNDATIONAL. Stable seed_key values, punctuation/acronym and repeated-family variety. |
| Companies | 81 | Within 75–150 target; mix of sample and real organizations. No normalized duplicate names in diagnostic check. |
| Job titles | 122 | Within 100–200 target; role-level variety. |
| Company/title links | 678 | All referenced keys exist; no repeated pair. 30 distinct title sets across 81 companies; 24 companies share 14-title sets by group. Treat as synthetic relevance data. |
| Institutions | 60 | Within 50–100 target; includes colleges/universities across countries. |
| Majors/specializations | 77 | Broader than currently exercised program offerings. |
| Degree types | 17 | Global vocabulary, with future private fallback. |
| Institution programs | 1,260 | Valid triples, but only two unique offering sets: 50 institutions have 22 combinations; ten have 16. Volume is not realism. |
| Certification boards | 20 | Within 15–30 target; URLs are metadata, not provenance verification. |
| Certification definitions | 84 | All board references valid; labels unique under board-scoped diagnostic normalization. Currency/issuer accuracy is not certified by this audit. |
| Focus areas | 20 | Within target; descriptions useful; many artifact labels differ from these seeds. No top-five constraint. |
| Users | 4 | ADMIN, complete fuller/lighter USER profiles, and incomplete USER; all have a development password. No passwordless/reset account. |
| Profile fixture compositions | 2 | `alex` and `jordan`; only MANUAL sources; custom examples not linked as normal records. |

## Exact checks and defects

1. All JSON decoded; CSV has 1,546 data rows and expected seed_key/label/category columns. No duplicate seed keys, full relationship tuples or diagnostic normalized labels in their relevant domain/board scopes.
2. All company/title, institution/major/degree and board/certification references resolve. All fixture user, focus and record references resolve, including board-plus-certification-name lookup. The eventual strict loader must retain these checks and validate attached custom selections.
3. `profile-fixtures.seed.json` lists skill `Communication`, which is absent from the CSV. This is a real unresolved fixture reference, not a request to silently alias `Business Communication` or invent a custom definition.
4. Skills fixtures use mutable display labels rather than stable keys; certification fixture uses a name rather than its supplied seedKey. Convert references to stable keys or explicitly document a strict lookup, rejecting ambiguity.
5. No reviewed title/program/certification-to-skill derivation mapping exists. Profile preview skills in artifacts are illustrative and must not be treated as algorithm output.
6. “Small Private Studio” and “Developer Productivity” are standalone `customCatalogExamples`; no owner-paired definitions, private relations or sources exercise isolation. Add two viewers with identical custom labels, including private parents/children and a private association between global definitions.
7. All four accounts include a known development password. The incomplete user does not exercise first-password setup. Add passwordless first access and previously onboarded reset fixtures after Q01; expose no live grant secret outside isolated tests. Runtime persistence must hash passwords.
8. Institution offerings are repeated templates, not evidence those real institutions offer each program. Mark demo mappings synthetic; curate a smaller verified/deliberately fictional set if UI says “Offered here”. Use distinct valid/incompatible/missing-parent test programs.
9. Skill category balance and templated industry labels warrant editorial sampling (e.g. repeated “Logistics …” labels); do not assert duplicates solely from resemblance. Test fuzzy queries such as `postgress`, `sofware engineer`, punctuation (C/C++/C#), multiword prefixes and whitespace without inserting typos as canonical catalog labels.

## Loader plan

Load catalogs before associations, users before private rows, domain records before provenance. Maintain deterministic seedKey-to-UUID resolution or stable UUID mapping; preserve keys across label updates. Upsert only explicitly seeded global fields, never take ownership of user-created values or overwrite edited profile data. Track a dataset version/checksum and reject unresolved references before partial import. A development profile reset must be an explicit separate command, not a side effect of routine catalog upsert.

Use transactions per cohesive dataset with a final integrity gate. Normalize with the approved runtime normalizer, validate categories/enums/dates/URLs, and fail with file/key/field context without passwords/connection strings. Repeating catalog imports must preserve IDs/counts and not duplicate associations. Repeating profile fixture setup must have a documented no-op or explicitly disposable-reset policy. Test rollback on an invalid later reference.

Separate test fixtures from demo volume: small owner/role/provenance fixtures for fast deterministic tests; an optional large synthetic catalog/admin dataset for query plans and pagination. Add boundary dates, same-name users, null names for admin-created accounts, tied created timestamps, multiple pages, last-source deletion, manual+two-derived skill sources, source replacement and simultaneous custom-create tests. “No exact match” and custom-parent fallback must be exercised in every relevant domain.

No seed loader was created or executed; idempotence, empty-database migration and password hashing remain PLANNED validation, owned by the relevant phase.
