# Design System

The Career Profile visual and interaction language is implemented once, in the `@career-profile/ui` workspace package, and reproduced from the HTML design artifacts in [`artifacts/`](artifacts/index.html).

- **Source of truth:** the HTML artifacts. Where they contradict markdown documents, the artifacts win. Where two artifacts contradict each other, design-system artifacts (`artifacts/design-system/**`) define component anatomy and page artifacts define composition and copy; between two design-system artifacts, the dedicated component specimen wins over the generic primitive specimen.
- **Implementation:** [`ui/`](../../ui/README.md) ([ADR 0011](../architecture/adr/0011-shared-ui-workspace-package.md)), built on React Aria Components ([ADR 0012](../architecture/adr/0012-react-aria-components.md)) and styled with CSS Modules over the artifact tokens ([ADR 0013](../architecture/adr/0013-css-modules-over-artifact-tokens.md)).
- **Gallery:** run `pnpm dev` and open `http://localhost:5173/gallery.html`. Every design-system artifact and the key page compositions are reproduced there with the real components. Items marked "Not artifact-backed" have no artifact yet and need design review.
- **Verification:** Playwright compares computed styles of gallery elements with their artifact counterparts (`web/e2e/parity/`), runs axe (WCAG 2.2 AA) on every gallery page, and keeps Linux screenshot baselines for a few pages. Intentional differences are listed in `web/e2e/parity/deviations.ts` and summarized under [Deviations](#deviations-from-the-artifacts).

## Layout

| Element | Rule |
|---|---|
| Navigation rail | 236px, fixed left, surface background with a 1px right line. Collapsed: 72px, icons only. |
| Main canvas | Left margin equals the rail width; padding 28px top, 32px sides, 60px bottom. |
| Page header | Title 26/32 semibold, description in `--ink-2`, actions on the right. On desktop inside the shell, the command trigger and sidebar toggle lead the actions. |
| Surfaces | 12px radius, `--e1` elevation, white. Padding `md` 20/24 or `lg` 28. |
| Grids | 2 or 3 columns with 16px gaps, 4 columns with 14px; all collapse to one column at 860px and below. |
| Dialog | 620px wide (760 wide variant), at most 100vw minus 48px; 14px radius, `--e3`; overlay padding 32px over `--scrim`. |
| Toast region | Fixed 24px from the top and 28px from the right; toasts are 320px wide. At 640px and below the region spans the width with 16px insets. |

## Design tokens

Tokens live in `ui/src/foundations/tokens.css` and reproduce the artifact `:root` block. A unit test keeps them identical to the artifact stylesheet apart from the two documented changes.

| Group | Token | Value | Usage |
|---|---|---|---|
| Surface | `--canvas` | `oklch(0.975 0.004 258)` | Page background |
| | `--surface` | `oklch(1 0 0)` | Cards, dialogs, rail |
| | `--sunken` | `oklch(0.958 0.005 258)` | Inputs, filters, neutral chips |
| | `--hover` | `oklch(0.944 0.006 258)` | Hovered rows and menu items |
| | `--line` / `--line-strong` | `oklch(0.915 0.006 258)` / `oklch(0.85 0.009 258)` | Dividers; checkbox and radio borders, inactive proficiency bars |
| | `--scrim` | `oklch(0.2 0.02 262 / .34)` | Modal backdrop |
| Ink | `--ink` | `oklch(0.21 0.02 262)` | Primary text |
| | `--ink-2` | `oklch(0.46 0.018 262)` | Secondary text |
| | `--ink-3` | `oklch(0.51 0.014 262)` | Faint text: meta, placeholders, overlines. **Changed** from the artifact's 0.54 so it meets WCAG AA (4.5:1) on sunken, tint, hover and toast surfaces. |
| Brand | `--brand` / `--brand-hover` / `--brand-fg` | `oklch(0.42 0.11 262)` / `oklch(0.37 0.11 262)` / `oklch(0.99 0 0)` | Primary actions, current page |
| | `--brand-tint` / `--brand-ink` | `oklch(0.952 0.022 262)` / `oklch(0.42 0.11 262)` | Current nav item, chips, active options |
| | `--ring` | `oklch(0.62 0.12 262)` | Keyboard focus outline |
| | `--brand-line` | `oklch(0.88 0.05 262)` | Drag lane outlines. **Added**: the artifact references it without defining it. |
| Accent | `--accent`, `--accent-tint`, `--accent-line` | hue 292 | Custom skill chips, accent focus icons |
| Semantic | `--success`, `--warning`, `--danger`, `--info` and their `-tint` | hues 155, 65/85, 25, 240 | Badges, callouts, empty-state icons |
| Toast surfaces | literal in the Toast module | success `oklch(0.925 0.055 155)` on `oklch(0.34 0.09 155)`; danger `oklch(0.93 0.045 25)` on `oklch(0.42 0.13 25)` | Full-surface semantic toasts |
| Elevation | `--e1`, `--e2`, `--e3` | line ring plus soft shadow | Cards; menus, popovers, toasts; dialogs and palette |
| Resume print palette | scoped to `ResumePaper` | `--resume-accent #1f3f77`, `--resume-body #334155`, `--resume-muted #475569`, `--resume-quiet #64748b`, `--resume-rule #cbd5e1` | The generated document only |

**Type:** Geist 14/20 for interface text and Geist Mono for counts, the logo and keyboard hints, both self-hosted through Fontsource. Scale: display 32/38 semibold; record 21/28 semibold; section 16/24 semibold; label 13 medium; meta 12/16; overline 11/16 semibold, 0.06em, uppercase, `--ink-3`.

**Radii:** 2 and 4 (proficiency bars, checkbox), 6 (kbd), 7 (small buttons, menu items), 8 (controls, chips), 9 (callouts, focus and placeholder icons), 10 (menus, toasts), 12 (surfaces), 14 (dialogs), 18 (auth illustration), 999 (badges), 50% (avatars).

**Spacing:** components use the artifact's literal values (4 to 28px, including 6, 10, 14, 18 and 22). Page layout uses Tailwind's 4px scale through the theme exported by the package.

**Control sizes:** button 36px (small 30, large 44, icon 36 square); input and select 40; catalog option at least 42; nav item 36; menu item 34; account menu item 38; command item 42; page button 32; filter control 36; chip at least 30; badge 24; kbd 22; avatar 32 (30 in tables, 48 in the profile header); logo 28.

## Components

Everything below is exported from `@career-profile/ui`. Components are presentational: data arrives through props and intent leaves through callbacks, never through GraphQL or the router.

| Area | Components | Variants and key props | Source artifacts |
|---|---|---|---|
| Foundations | `Icon`, `Text`, `VisuallyHidden`, `UiProvider` | 30 artifact icons; text variants and tones; `UiProvider` takes the router's `navigate` and `useHref` and hosts toasts | color, type-layout |
| Actions | `Button`, `ButtonLink`, `TextLink`, `BackLink` | `variant` primary, secondary, ghost, danger; `size` sm, md, lg; `isIconOnly` requires `aria-label`; `isPending` | actions-inputs |
| Fields | `TextField`, `TextAreaField`, `PasswordField`, `Select`, `Checkbox`, `RadioGroup`, `Radio` | `label`, `description`, `errorMessage`, `isRequired` (label gets `*`), `leadingIcon`; caller-reported validation | actions-inputs, form-states, employment-type |
| Layout | `Surface`, `Stack`, `Grid`, `Row`, `Brand` | `padding`; `gap`; `columns` 2, 3, 4; `justify` | type-layout, sidebar |
| Feedback | `Badge`, `Avatar`, `Chip`, `ChipList`, `Callout`, `Kbd`, `ShortcutHint`, `Skeleton`, `LoadingSkeleton`, `ProgressBar`, `Stepper`, `ToastProvider`/`useToast`, `ToastView` | badge tones; chip brand, neutral, custom; callout info, success, warning, danger; toast success or danger with optional action | feedback, overview, onboarding |
| States | `EmptyState`, `FormErrorSummary` | `tone` brand or danger (load failure); summary focuses itself | collection-states, form-states |
| Overlays | `Dialog` (with `DialogHeader`, `DialogBody`, `DialogFooter`, `DialogTrigger`), `Menu`, `MenuList`, `MenuItem`, `MenuSection`, `MenuSeparator`, `MenuTrigger`, `Tooltip`, `Tabs`, `TabList`, `Tab`, `TabPanel` | dialog `size`, `isPending`, `role`; menu item `icon`, `tone`; tabs support `href` | overlays, account, avatar-menu |
| Shell | `AppShell`, `PageHeader`, `CommandTrigger`, `SidebarToggle`, `CommandPalette`, `useShellShortcuts`, `useShell` | `navigation` sections, `currentItemId`, `account` actions, `commands` | sidebar, keyboard-shortcuts, command-palette, overview-mobile |
| Catalog | `CatalogCombobox` | `search(query, { signal, parentContext })`, `value`, `onChange`, `onCreateCustom`, `customNoun`, `hideLabel` | catalog-combobox, catalog-custom-values, dependent-fields, every `*-search.html` |
| Profile | `ProfileRecordDialog`, `ProfileSection`, `RecordItem`, `RecordActionsMenu`, `ProfileHero`, `ProfilePlaceholder`, `FocusCard` | section `variant` embedded or page, `flush`; record `compact`; focus `iconTone`, `isPrimary` | profile-record-dialog, profile-records, profile, overview-empty, experience, focus |
| Skills | `SkillBoard`, `SkillCategoryCard`, `ProficiencyLane`, `ProficiencyIndicator` | `mode` view or edit, `collapsedCount`, `onMove`, `onRemove` | skills, skills-edit, profile |
| Tables | `TableToolbar`, `TableSearchField`, `FilterSelect`, `DataTable`, `SortableHeader`, `PersonCell`, `TableStateRow`, `TableScrollRegion`, `Pagination` | filter label prefix; sort direction; page, size and total | admin-table, admin/users |
| Public and resume | `AuthLayout`, `AuthHeader`, `AuthShowcase`, `FileDropzone`, `ChooseFileButton`, `ResumePreview`, `ResumePaper`, `ResumeHeader`, `ResumeSection`, `ResumeSummary`, `ResumeItem`, `ResumeSkills` | accepted file types; document sections | auth/login, onboarding/basics, resume/upload, resume/generated |

Not provided by the library: a command registry (the app passes only the commands the user may run), a table controller or URL state, a `DependentCatalogField` (render the child only when the parent has a value and clear it when the parent changes), and date pickers.

## States and interactions

| Element | State | Behavior |
|---|---|---|
| Button | Hover | Primary darkens to `--brand-hover`; other variants keep their surface. |
| Button | Disabled or pending | 45% opacity, not-allowed cursor. Pending stays focusable, ignores presses and shows the pending label ("Saving…"). |
| Any control | Keyboard focus | 2px `--ring` outline, 2px offset. Text inputs and the select trigger instead show the artifact focus: surface background, 1px brand border, 3px `--brand-tint` halo. Menu and option rows draw the ring inset. |
| Input | Invalid | Surface background with a 1px danger border; error text below in `--danger`. |
| Select, filter | Open | Popover with `--e2`, rows 34px, the selected row checked. |
| Dialog | Open | Focus moves inside and is trapped; Escape closes; focus returns to the trigger. Scrim clicks close only when `isDismissable`. While pending, nothing dismisses it. |
| Toast | Shown | Success is announced politely, danger assertively. Plain toasts hide after 2600 ms; toasts with an action (Undo) after 8000 ms. The timer pauses while hovered or focused. Each toast has a Dismiss button. |
| CatalogCombobox | Typing | Search waits 250 ms after the last keystroke; each new query aborts the previous request and stale responses are ignored. |
| CatalogCombobox | Results | "Create custom {noun} “query”" first (when allowed and nothing matches exactly), then ranked options with the match in bold and right-aligned meta. Already-added values are visible but disabled. |
| CatalogCombobox | Loading, no results, error | Skeleton rows; "No catalog matches" with a keyboard-reachable Create custom option; "Search failed." with a Retry option. Loading, no-results and error are announced. |
| CatalogCombobox | Blur | Unfinished text reverts to the selected label; empty text clears the value. Escape first closes the popover, then the surrounding dialog. |
| Shell | Cmd/Ctrl+B | Toggles the rail without remounting the page. Ignored inside contenteditable editors and while a blocking dialog is open. |
| Shell | Cmd/Ctrl+K | Opens the command palette with focus in its search. Ignored while a blocking dialog is open. Both shortcuts prevent the browser default only when they act. |
| Command palette | Open | First command active; Arrow Up/Down move; Enter runs and closes; Escape closes and restores focus; "No matching commands" when the filter matches nothing. |
| Skill chip (edit) | Drag | The chip dims (42% opacity with a `--brand-line` ring); lanes of the same category show a dashed outline and highlight on hover; the other category dims to 62% and rejects the drop. |
| Skill chip (edit) | Press | Click, Enter or Space opens the Move menu (the keyboard path): Move to each other level, the current level checked, and Remove skill. The × button removes the skill and never starts a drag. |
| Skill lane | Collapsed | "Showing n of m" and Show all / Show fewer; a chip that was just moved into the lane stays visible. Empty lanes read "No skills at this level". |
| Table | Sort | Header buttons toggle ascending and descending; `aria-sort` reports the state. |

## Responsive behavior

| Breakpoint | Changes |
|---|---|
| Above 1080px | Auth showcase in three benefit columns with the record-to-skills arrow. |
| 1080px and below | Auth benefits stack and the illustration becomes one column. |
| 860px and below | The rail becomes a top bar (brand plus ☰) that opens a navigation drawer with the same destinations and the account actions; main padding becomes 20px; shortcut controls hide; all grids and the skill board stack; the auth illustration hides. |
| 720px and below | Table toolbars stack the search above scrolling filters; the resume paper uses 34/28 padding and stacks its header and items. |
| 640px and below | Empty-profile placeholder rows stack with full-width actions; toasts span the viewport. |

Tables scroll horizontally inside a named, focusable region instead of widening the page.

## Edge cases

- **Long labels:** chips wrap within their padding; badges, table headers and the page-number buttons stay on one line; the account name truncates with an ellipsis.
- **Empty collections:** use `EmptyState` with one action; never a blank card. An empty lane shows "No skills at this level".
- **Loading:** `LoadingSkeleton` (a title bar and three lines) announced as a status; catalog searches show two skeleton rows.
- **Errors:** collection load failures use the danger `EmptyState` with Retry; form failures use `FormErrorSummary` and keep the entered values.
- **Missing data:** show "Not provided" rather than empty space.

## Animation and motion

The artifacts define no transitions or animations, so the library adds none; the skeleton is static.

## Accessibility

- Color is never the only cue: statuses have text, proficiency has text plus bars, custom skills say "Custom", required fields have `*` and `aria-required`.
- Every icon is decorative; icon-only buttons need an `aria-label` (enforced by the `Button` types).
- Dialogs, the palette and the drawer trap focus and restore it; the collapsed rail keeps link names (visually hidden) and adds tooltips.
- Shortcut controls expose `aria-keyshortcuts="Meta+K Control+K"` and `"Meta+B Control+B"`, and show `⌘` on Apple platforms and `Ctrl` elsewhere.
- Drag and drop always has the Move menu as its keyboard and screen-reader alternative; moves and removals are announced.
- The auth illustration repeats product copy and is hidden from assistive technology.

## Deviations from the artifacts

These are deliberate and checked by the parity suite:

- `--ink-3` darkened for contrast, and `--brand-line` defined (see Tokens).
- A visible keyboard focus ring on every control (the artifacts only style input focus).
- Field error text and destructive menu items use `--danger`. In the artifact CSS, `.field .help` and `.menu .mi` outrank `.danger-text`, so they render grey.
- Login input icons are vertically centred. In the artifact CSS, `.auth-card .lead` also matches the icon wrapper and pushes it 6px down.
- Lane counts are written "Showing n of m" and uppercased in CSS, so screen readers read words.
- The collapsed rail keeps labels for assistive technology instead of `display: none`; the account button is named by its visible text; chips do not set `touch-action: none`.
- The command palette's command icons use the standard 1.8 stroke width.
- Tables scroll inside their own region at narrow widths.

Resolved by the conflict rule: "Create custom" is the first option (catalog-combobox specimen); dialog close buttons use the SVG ×; the command trigger and sidebar toggle appear in page headers; the skill category header always shows its count badge; the mobile shell is a top bar with a drawer (profile/overview-mobile), not the bottom bar in `design-system/shell/mobile.html`. The dashed `hidden-preview` boxes in the artifacts are reviewer annotations and are not product UI.

## Not yet defined by an artifact

- The tooltip, drawer, toast action button and file drag-over highlight are built from existing tokens and marked in the gallery; they need design review.
- The **inferred** skill chip treatment and its source-details popover (manual catalog, custom and inferred are the three required treatments) wait for an artifact; the library ships catalog and custom only.
