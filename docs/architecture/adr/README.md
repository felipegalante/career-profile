# Architecture Decision Records

ADRs in this directory record **technical architecture choices only**: runtime architecture, persistence, API style, authentication mechanism, service/data boundaries, search infrastructure, and similar decisions with broad technical consequences.

Do **not** create ADRs for ordinary product requirements, UI behavior, terminology, acceptance criteria, or local implementation details.

| ADR | Technical decision | Status |
| --- | --- | --- |
| [0001](0001-modular-monolith.md) | Modular monolith repository/runtime architecture | Accepted |
| [0002](0002-graphql-yoga-api.md) | GraphQL Yoga as product API | Accepted |
| [0003](0003-server-managed-session-cookies.md) | Server-managed session cookies | Accepted |
| [0004](0004-profile-centered-domain-modules.md) | Profile-centered domain module boundaries | Accepted |
| [0005](0005-multi-source-skill-provenance.md) | Separate multi-source skill provenance model | Accepted |
| [0006](0006-focused-graphql-mutations.md) | Focused GraphQL mutations over aggregate replacement | Accepted |
| [0007](0007-server-orchestrated-custom-catalog-values.md) | Server-orchestrated viewer-private custom catalog values | Accepted |
| [0008](0008-postgresql-catalog-search.md) | PostgreSQL + pg_trgm for shared catalog search | Accepted |
| [0009](0009-drizzle-orm.md) | Drizzle ORM on node-postgres | Accepted |
| [0010](0010-fastify-http-runtime.md) | Fastify 5 HTTP runtime | Accepted |

The project is pre-implementation. Once implementation begins, materially changing an accepted ADR should normally create a superseding ADR rather than rewriting history.
