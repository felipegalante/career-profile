# ADR 0009: Drizzle ORM on node-postgres

- Status: Accepted
- Date: 2026-09-19

## Context

The profile schema has enough related entities, transactions, constraints, and migrations that raw `pg` everywhere would create avoidable mapping/query boilerplate. The application also needs direct access to PostgreSQL-specific behavior.

## Decision

Use Drizzle ORM for application persistence on top of the `pg` driver, and Drizzle Kit for schema-driven migrations. Generated SQL migrations are version-controlled. Use Drizzle's SQL escape hatch or explicit migration SQL for PostgreSQL-specific features such as `pg_trgm` and specialized indexes.

Layering:

```text
GraphQL resolver
  → application service
  → repository
  → Drizzle
  → pg
  → PostgreSQL
```

## Consequences

- Strong TypeScript inference for schema/queries.
- Less manual row mapping and transaction boilerplate.
- PostgreSQL-specific capabilities remain available.
- Phase 0 must replace the starter bootstrap migration approach before domain migrations begin.
