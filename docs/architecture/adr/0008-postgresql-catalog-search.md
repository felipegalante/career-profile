# ADR 0008: PostgreSQL catalog search with pg_trgm

- Status: Accepted

## Context

Skills, companies, job titles, institutions, majors/specializations, degree types, certification boards/exams, and focus areas need responsive server-side autocomplete with typo tolerance and deterministic ranking.

## Decision

Use PostgreSQL normalization plus `pg_trgm` for catalog search. Standard ranking is exact → prefix → substring → trigram similarity, with domain relationship relevance allowed to influence ranking. Add GIN/GiST trigram indexes where justified by data volume/query plans.

## Consequences

- search remains in the primary datastore;
- no external search service is required for the initial release;
- shared ranking/visibility SQL helpers should be reused across domain repositories;
- PostgreSQL-specific queries are acceptable through Drizzle's parameterized SQL escape hatch.
