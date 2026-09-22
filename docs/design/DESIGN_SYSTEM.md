# Design System

The application uses a small token-based design system so all profile modules feel cohesive.

## Foundations

- rendered indigo primary palette with cool neutral surfaces;
- cool neutral backgrounds/surfaces;
- semantic success/warning/danger colors;
- Geist with system sans-serif fallback;
- spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48;
- radii: 6 / 10 / 14;
- subtle elevation only where hierarchy requires it.

## Core primitives

- Button / IconButton
- Input / PasswordInput
- Select
- Checkbox / Radio
- Card
- Badge
- Avatar
- Dialog
- Toast
- DropdownMenu
- Combobox primitives
- EmptyState
- LoadingIndicator / Skeleton

## Shared application components

- AppShell
- AppHeader
- ProfileHeader
- ProfileSummaryCard
- `ProfileRecordDialog`
- `CatalogCombobox`
- `DependentCatalogField`
- SkillCategoryCard
- ProficiencyLane
- SkillChip
- DataTable
- UserTable (DataTable composition)

## CatalogCombobox

Use for Skills, Company, Job Title, Institution, Major / Specialization, Degree Type, Certification Board, Certification / Exam, and Professional Focus. Full behavior: [`components/catalog-combobox.md`](components/catalog-combobox.md).

## ProfileRecordDialog

Work Experience, Education, and Certification forms share an accessible dialog baseline: [`components/profile-record-dialog.md`](components/profile-record-dialog.md).

## SkillChip drag behavior

In Skills edit mode, `SkillChip` is draggable. Dragging changes **proficiency only**, never `SkillCategory`.

- Technical chips may move among Technical Beginner / Intermediate / Advanced lanes only.
- Foundational chips may move among Foundational Beginner / Intermediate / Advanced lanes only.
- Lanes in the opposite category are visually unavailable and reject the drop.
- The keyboard-accessible `Move to…` menu exposes proficiency destinations only and is the non-pointer equivalent.
- View-mode chips are not draggable.

## SkillChip source treatments

`SkillChip` has three named source treatments: manually added catalog, custom, and inferred. Use a distinct color treatment for each, paired with visible text/iconography so color is never the only cue. A chip with any active Work Experience, Education, or Certification source uses the inferred treatment. Its focusable source-details control shows the contributing record names and types on hover, keyboard focus, or touch activation; it must not rely on hover alone.

## Proficiency indicator

Use text plus a three-step visual indicator; never rely on color alone:

```text
Beginner      ● ○ ○
Intermediate  ● ● ○
Advanced      ● ● ●
```

## Responsive

Two-column profile/skills layouts stack on narrow screens. Dialogs become near-full-screen sheets where needed. Catalog result popovers use available viewport height and remain keyboard reachable.

## DataTable

All table screens use a shared DataTable pattern with server-backed pagination, page-size selection, content-specific filters, sortable columns, and search where appropriate. Search inputs vertically center leading icons/placeholders. See the product Data Tables specification.

## PasswordInput

All password fields use a shared PasswordInput with a trailing, keyboard-accessible eye control that toggles masking.

## Toasts

Success and danger toasts use a clearly semantic green/red background across the **entire** toast surface. Do not render a colored left stripe or communicate status only through an edge treatment.

## Professional Focus cards

Focus cards use an icon plus label/description. Primary status uses a badge. Do not use a decorative colored left border.

## Skill category header

The category title and total-count badge share a vertically centered header row so count chips align consistently across Technical and Foundational cards.

## Input and placeholder alignment

Inputs, comboboxes, search fields, and input-like specimens use shared vertical centering for value text, placeholder text, and leading/trailing icons.


## Generated resume document

The generated resume is a document layout, not another application card surface. Use a single-column print hierarchy with minimal accent color, conventional section headings, and no decorative profile UI. The application may present the document on a canvas with preview/download actions outside the paper.

## Keyboard shortcuts and command palette

The application shell includes visible shortcut affordances and a shared `CommandPalette` overlay.

- `Cmd+B` / `Ctrl+B`: collapse or expand the sidebar.
- `Cmd+K` / `Ctrl+K`: open command palette.
- Command palette: search input, grouped commands, active-row state, optional shortcut hint, empty state.
- Palette interaction: Arrow Up/Down, Enter, Escape, focus restoration.
- Sidebar collapsed state keeps icons/avatar and uses tooltips/accessible labels for hidden text.

Use a compact `kbd` visual treatment for hints. Platform-specific labels should display `⌘` on macOS and `Ctrl` elsewhere.
