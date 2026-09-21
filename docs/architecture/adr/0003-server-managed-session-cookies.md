# ADR 0003: Server-managed session cookies

- Status: Accepted
- Date: 2026-09-19

## Context

The application is browser-oriented and needs simple credential-based authentication without exposing long-lived bearer tokens to browser JavaScript.

## Decision

Use server-managed sessions referenced by an HttpOnly, Secure-in-production, SameSite cookie. GraphQL context resolves the authenticated viewer from the session.

## Consequences

- Session invalidation is server-controlled.
- CSRF/cookie configuration must be deliberate.
- Session persistence requires a database-backed sessions table or equivalent server store.

## Not covered

The product's choice to exclude SSO/MFA/email verification belongs in the Authentication feature spec.
