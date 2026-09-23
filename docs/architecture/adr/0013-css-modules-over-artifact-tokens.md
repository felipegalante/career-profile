# ADR 0013: CSS Modules over artifact design tokens

- Status: Accepted
- Date: 2026-09-22

## Context

The design artifacts express the visual system as one hand-written stylesheet (`docs/design/artifacts/assets/styles.css`) of CSS custom properties and generic class names such as `.btn`, `.input`, `.menu`, `.option`, `.empty`, and `.table`. Reproducing it faithfully matters more than any particular authoring style, and reviewers need to be able to compare implementation rules with artifact rules.

Tailwind CSS v4 is already part of the web toolchain. Its Preflight reset removes browser defaults, such as heading weights and list bullets, that the artifact rules rely on. Generic global class names would collide as the application grows.

## Decision

- Design tokens are global CSS custom properties in `ui/src/foundations/tokens.css`, reproducing the artifact `:root` block. Intentional token differences are listed in [DESIGN_SYSTEM.md](../../design/DESIGN_SYSTEM.md) and checked by a unit test against the artifact stylesheet.
- Global base rules (box sizing, body typography, form-control font inheritance, focus outline) live in `ui/src/foundations/base.css`.
- Every component owns a co-located CSS Module whose rules copy the artifact rules and keep the artifact class names, so both can be diffed.
- Fonts are self-hosted through Fontsource packages with the artifact family names.
- `web` uses Tailwind only for page-level layout. It imports Tailwind's theme and utilities layers without Preflight, and `@career-profile/ui/tailwind-theme.css` maps the design tokens into the Tailwind theme.

## Consequences

- Component styles are scoped and cannot collide with page styles.
- Without Preflight, Tailwind border utilities need an explicit border style.
- Playwright computed-style parity tests compare rendered components with the artifact pages.
- A token change is made once in `tokens.css` and recorded in the design system document.

## Not covered

Individual token values and component visuals are owned by the design artifacts and [DESIGN_SYSTEM.md](../../design/DESIGN_SYSTEM.md).
