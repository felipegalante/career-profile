# ADR 0011: Shared UI workspace package

- Status: Accepted
- Date: 2026-09-22

## Context

The design artifacts define one visual and interaction language for every authenticated and public surface: tokens, primitives, the application shell, collection and form states, and presentational domain compositions such as the catalog combobox, record dialog, skill lanes, and data table parts. Every product phase composes the same pieces. Keeping them inside `web/src` makes it easy for presentational code to reach into GraphQL operations, routing, or domain rules, which would couple the visual layer to individual features.

[ADR 0001](0001-modular-monolith.md) establishes `api` and `web` as pnpm workspaces in one repository.

## Decision

Add a third pnpm workspace, `ui/`, published inside the monorepo as `@career-profile/ui`.

- The package ships TypeScript/TSX source. Its `exports` map points at `src`, and `web` consumes it through `workspace:*`; the web Vite build compiles it. There is no separate build step.
- It contains design tokens, global base styles, primitives, shell components, state components, and presentational compositions defined by the design artifacts.
- It does not import GraphQL documents or clients, `react-router`, or domain business rules. Components receive data through props and report intent through callbacks. Navigation goes through the router adapter described in [ADR 0012](0012-react-aria-components.md).
- `react`, `react-dom`, their type packages, and `typescript` resolve through a pnpm catalog so `ui` and `web` share one React type identity.
- The package owns its typecheck and unit-test scripts; the root `typecheck` and `test` scripts run them between `api` and `web`.

## Consequences

- The package manifest enforces the boundary: `ui` has no dependency on GraphQL tooling or the router.
- `web` type-checks the imported `ui` source under its own compiler options, so `ui` must compile under both configurations.
- Components can be built ahead of their first feature consumer. Their APIs remain provisional until a feature uses them, and a component existing does not satisfy a product acceptance criterion.
- The package is private and cannot be published without adding a build step.

## Not covered

Component inventory, props, and visual rules live in [DESIGN_SYSTEM.md](../../design/DESIGN_SYSTEM.md). The headless accessibility layer is [ADR 0012](0012-react-aria-components.md); the styling approach is [ADR 0013](0013-css-modules-over-artifact-tokens.md).
