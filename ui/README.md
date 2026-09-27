# @career-profile/ui

Shared React components, design tokens and global styles for Career Profile. The visual and interaction rules, the component inventory and the deviations from the design artifacts are documented in [docs/design/DESIGN_SYSTEM.md](../docs/design/DESIGN_SYSTEM.md).

## Using the package

`web` depends on it through `"@career-profile/ui": "workspace:*"`. The package ships TypeScript source; the web Vite build compiles it.

1. Import the package entry anywhere; it loads the fonts, tokens and base styles before any component styles.
2. Import Tailwind without Preflight, plus the token theme, in the app stylesheet:

   ```css
   @layer theme, base, components, utilities;
   @import "tailwindcss/theme.css" layer(theme);
   @import "tailwindcss/utilities.css" layer(utilities);
   @import "@career-profile/ui/tailwind-theme.css";
   ```

3. Render `UiProvider` inside the router so library links, menu items and tabs navigate client-side, and toasts have a region:

   ```tsx
   const navigate = useNavigate();
   <UiProvider navigate={navigate} useHref={useHref}>{app}</UiProvider>
   ```

Component styles live in the `components` cascade layer, so Tailwind utilities on a component root (for example a margin) take effect.

## Boundaries

The package must not import GraphQL documents or clients, `react-router`, or domain business rules. Components take data through props and report intent through callbacks; command lists, table query state and validation belong to the consuming feature.

## Layout of the source

```
src/
  foundations/  tokens, fonts, base styles, Icon, Text, platform helpers, UiProvider
  primitives/   buttons, fields, layout, feedback, overlays, toast
  states/       empty and form error states
  shell/        AppShell, PageHeader, shortcut controls and hook
  components/   CatalogCombobox, CommandPalette, profile compositions, skills, data table, auth, dropzone, resume
```

Each component folder holds the component, its CSS Module (rules copied from `docs/design/artifacts/assets/styles.css`, keeping the artifact class names where they apply) and its tests.

## Scripts

- `pnpm --filter @career-profile/ui test`: Vitest and Testing Library behaviour tests, including the token parity check against the artifact stylesheet.
- `pnpm --filter @career-profile/ui typecheck`

The component gallery and the Playwright parity, accessibility, drag-and-drop and visual suites live in `web` (`web/gallery.html`, `web/e2e/`).
