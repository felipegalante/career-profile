# Test Strategy

## Principles

- Acceptance criteria drive behavioral coverage.
- Business invariants belong at service/database layers rather than only UI tests.
- Authorization/ownership boundaries require negative tests.
- Shared catalog behavior is tested once deeply plus domain-specific parent/relationship behavior per feature.

## Unit/domain

- email/catalog normalization;
- password policy;
- date/year validation;
- catalog ranking helper inputs/score tiers;
- dependent-selection clearing rules;
- provenance reconciliation;
- professional-focus primary invariant.

## Database/integration

- normalized email uniqueness;
- global vs viewer-owned custom catalog uniqueness/visibility;
- custom values never leak across users;
- company/title association traversal;
- institution program traversal;
- certification board/exam traversal;
- pg_trgm ranking/index-supported query behavior;
- concurrent duplicate custom-create cases;
- user-skill/provenance invariants;
- clean migration + seed load.

## GraphQL integration

- auth/viewer/session;
- admin-created first-password setup and admin reset-password;
- forbidden admin/self-ownership operations;
- catalog searches and custom selection resolution;
- work/education/certification CRUD with parent validation;
- Professional Focus ordering/primary;
- skills search/add/move/remove, including provenance-aware removal;
- stable error codes.

## Frontend

Shared UI (`ui/`) layers:

- Vitest, Testing Library and `user-event` behavior tests per component, including a check that the design tokens match the artifact stylesheet;
- the component gallery (`web/gallery.html`) with Playwright computed-style parity against the artifacts (intentional differences listed in `web/e2e/parity/deviations.ts`), axe WCAG 2.2 AA scans of every gallery page and open overlay, shortcut, drawer, combobox, dialog, table and drag behaviors, with drag verified on Chromium, Firefox and WebKit;
- Linux screenshot baselines for a few gallery pages, run by the CI `visual` job (`pnpm --filter web test:visual` with `VISUAL=1`).

Feature coverage:

- shared `CatalogCombobox`: debounce, stale protection, keyboard, loading/no-results/error, custom option;
- skill chip remove control: click/keyboard activation, drag isolation, lane count update, optimistic success and rollback on failure;
- dependent child hidden until parent selected;
- parent change clears child;
- work experience Company → Job Title;
- education Institution → Major / Specialization → Degree Type;
- certification Board → Certification / Exam;
- Professional Focus add/custom/reorder/primary;
- Skills collapsed/expanded/edit/search/custom/move/remove;
- auth/onboarding/admin flows.

## Critical E2E journeys

1. Register → onboarding → Profile.
2. Add custom/catalog Company + Job Title → experience saved.
3. Add Institution/program → education saved; add Board/exam → certification saved.
4. Add Professional Focus and set primary.
5. Search/add skill → move proficiency → remove.
6. Admin signs in → creates user.

## Data table behavior

- pagination metadata and boundary pages;
- search/filter/sort combinations;
- page reset after filter/search changes;
- stable server ordering;
- accessible sort/pagination controls.

## Skills drag-and-drop

- exercise pointer drag/drop as a required interaction, not only the Move menu;
- verify Technical chips can move among Technical proficiency lanes;
- verify Foundational chips can move among Foundational proficiency lanes;
- verify cross-category drag targets are unavailable and do not mutate category;
- verify failed optimistic proficiency moves roll back.

## Application shell shortcuts

Frontend/integration coverage includes:

- Meta+B and Control+B toggle the sidebar and preserve route/in-page state;
- Meta+K and Control+K open the command palette and focus its search field;
- browser defaults are prevented only when the app accepts the shortcut;
- blocking dialogs prevent command-palette stacking;
- rich-text/contenteditable controls can reserve bold behavior;
- Arrow Up/Down and Enter navigate/activate commands;
- Escape closes the palette and restores focus;
- role-gated commands such as Admin Users are absent for unauthorized users;
- contextual Profile commands appear only where applicable;
- every shortcut has a visible/focusable non-shortcut affordance.
