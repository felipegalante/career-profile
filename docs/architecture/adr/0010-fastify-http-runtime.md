# ADR 0010: Fastify HTTP runtime

- Status: Accepted

## Context

The API needs a small TypeScript HTTP host for GraphQL Yoga, operational routes, request lifecycle hooks, and session/cookie integration. The application benefits from a plugin-oriented runtime with strong TypeScript support and low overhead.

## Decision

Use Fastify 5 as the Node.js HTTP application runtime. Mount/integrate GraphQL Yoga at `/graphql`; register operational routes and infrastructure such as cookies/sessions as Fastify plugins.

## Consequences

- API bootstrap, tests, and middleware concepts use Fastify plugins/hooks;
- Fastify `inject()` is preferred for lightweight HTTP route tests;
- framework-specific code stays near transport/infrastructure boundaries;
- domain/application services remain framework-agnostic.
