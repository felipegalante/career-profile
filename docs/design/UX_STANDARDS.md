# UX Standards

## Forms

- Labels remain visible; placeholders are examples, not labels.
- Required fields are identified consistently.
- Validate on submit and, where useful, after blur; avoid noisy validation on every keystroke.
- Preserve form input after recoverable server errors.
- Save buttons show loading and prevent duplicate submission.
- Cancel closes/discards only unsaved local edits.

## Dialogs

- Focus moves into dialog on open and returns to trigger on close.
- Escape closes non-destructive dialogs unless a blocking operation is in progress.
- Focus is trapped while dialog is active.
- Destructive operations require either confirmation or a clearly reversible pattern.
- Mobile dialogs can become near-full-screen sheets.

## Combobox/autocomplete

Use the shared `CatalogCombobox` for catalog-backed profile fields.

- Debounce remote searches.
- Protect against stale responses.
- Arrow keys move active option.
- Enter selects.
- Escape closes.
- Screen reader receives expanded state, active option, loading, and result count.
- No-results state should distinguish `nothing found` from a request failure.
- Eligible fields expose a consistent `Create custom {noun} “query”` option, listed first, when there is no exact visible match; in the no-results state it remains a keyboard-reachable option.
- Search results can include global values plus only the current viewer's custom values.
- The first Escape closes the listbox; the next closes the surrounding dialog.

## Dependent fields

- Child catalog fields are hidden until the parent field has a selection.
- Clearing/changing a parent clears incompatible child values immediately.
- Do not render a disabled empty child control merely to hint at future fields; reveal it when actionable.
- Known parent relationships should influence child result relevance, while custom parents retain fallback/custom paths.

## Feedback

Use toasts for short-lived confirmation. Use inline/banner errors for errors that require a decision or retry.

Skill removal/dismissal is the approved reversible destructive pattern: remove the chip immediately, then provide an `Undo` toast. A persistence error restores the prior chip and counts instead of offering a misleading success state.

Toast timing: plain toasts hide after 2600 ms; toasts with an action such as `Undo` stay for 8000 ms so keyboard and screen-reader users can reach the action. Timers pause while the pointer or keyboard focus is inside the toast, and every toast has a Dismiss button.

Success feedback examples:

- Profile updated
- Skill added at Intermediate
- User created

Error feedback examples:

- This skill is already in your profile
- Could not save changes. Try again.

## Optimistic updates

Use only when rollback is straightforward and the operation is low risk. Skill proficiency movement is a good candidate. Account creation and multi-field forms are not.

## Loading and empty states

Every data-driven page defines:

- initial loading;
- empty;
- populated;
- error/retry;
- mutation-in-progress where applicable.

Do not use a blank card as an empty state.

## Drag and drop

Drag-and-drop is a **required interaction** for reorganizing Skills proficiency in edit mode. It must be implemented and tested as a first-class path, not deferred as progressive enhancement.

The accessible `Move to…` menu is also required so keyboard and assistive-technology users can perform the same proficiency change. Dragging never changes Skill Category: Technical chips can only be dropped into Technical proficiency lanes, and Foundational chips only into Foundational lanes.

## Responsive rules

- Profile navigation collapses on narrow screens.
- Two-column skill categories stack vertically.
- Chips wrap naturally; long labels can wrap to two lines before truncation.
- Tables may become card rows or use deliberate horizontal scrolling.
- Forms become one-column on narrow screens.

## Content style

- Use action-oriented button copy: `Add experience`, `Save`, `Edit skills`.
- Prefer `Not provided` to ambiguous empty space.
- Avoid domain jargon when a user-facing phrase is clearer.

## Input alignment

All text inputs, search controls, comboboxes, and input-like catalog examples vertically center text and placeholders with their leading/trailing icons. Alignment is a shared primitive requirement rather than a per-screen adjustment.

## Secondary management surfaces

When a focused management surface takes the user away from `/profile`, show a visible `Back to Profile` control at the top. Keep one primary CTA per action on that surface; do not duplicate the same CTA in both the page header and section header/empty state. Dialogs use their close/cancel affordance instead.

## Data tables

Pagination, filtering, sorting, and search are first-class behaviors rather than afterthoughts. Table filters must match the semantics of the displayed columns. Search fields align icons and placeholder text on a shared vertical center.

## Feedback

Semantic toasts use a full green/red success/danger surface, icon, text, and dismiss control. Do not render a semantic stripe on the left edge.


## Table toolbar layout

Data-table filter and sort controls use compact filled/neutral controls without outlined borders or inset border treatments. The table search field expands to consume the available space between the left edge and the filter group; avoid unexplained blank toolbar space. On narrow screens, the search field occupies its own row and filters may scroll/wrap.


## Skill chip removal

Editable skill chips expose a dedicated `×` button.

- it is a semantic button, not decorative text;
- it has an accessible `Remove {skill}` label;
- pointer/keyboard activation invokes removal without triggering drag;
- removal updates visible/total lane state consistently;
- optimistic removal must roll back on persistence failure.

## Global keyboard shortcuts

Authenticated desktop surfaces support two required accelerators:

- `Cmd+B` / `Ctrl+B` — toggle the application sidebar;
- `Cmd+K` / `Ctrl+K` — open the global command palette.

Shortcut behavior must remain discoverable through visible controls and shortcut hints. The command palette uses Arrow Up/Down, Enter, and Escape. Focus returns to the invoking control when the palette closes. Do not stack the palette over a blocking dialog, and do not steal `Cmd/Ctrl+B` from an intentional rich-text/contenteditable editor.

## Focus and contrast

- Every interactive control shows a 2px `--ring` outline on keyboard focus; text inputs, comboboxes and select triggers use the input focus treatment (brand border plus tint halo) instead.
- Text, including faint meta text, meets WCAG AA contrast (4.5:1) on every surface it appears on.
