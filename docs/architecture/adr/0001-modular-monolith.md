# ADR 0001: Modular monolith

- Status: Accepted
- Date: 2026-09-19

## Context

The application contains several related domains that need clear boundaries and shared transactions, but there is no current need for independently deployed services.

## Decision

Use one repository and deployable backend organized as domain/application modules, with separate `api` and `web` pnpm workspaces. Keep domain boundaries explicit so future extraction remains possible without paying distributed-system cost now.

## Consequences

- Cross-profile transactions remain straightforward.
- One deployment/database is sufficient for the current scale.
- Module boundaries must be maintained in code review rather than through network isolation.

## Not covered

Feature scope and profile page structure are defined in product/design specs.
