# ADR 0002: GraphQL Yoga product API

- Status: Accepted

## Context

The React client needs a typed API for related profile entities and focused mutations. Fastify is the HTTP runtime, while product/domain operations should use a single GraphQL boundary rather than parallel REST resources.

## Decision

Expose product/domain operations through GraphQL Yoga at `/graphql`, integrated with Fastify. Operational endpoints such as `/healthz` may remain plain Fastify routes and are not an alternate product API.

## Consequences

- schema/resolvers become a first-class contract;
- resolvers remain thin and call application services;
- Fastify plugins can provide session/context infrastructure around Yoga;
- product REST endpoints should not be introduced without a new architecture decision.
