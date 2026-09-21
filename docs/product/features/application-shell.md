# Feature: Application Shell and Keyboard Shortcuts

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**
- Applies to: authenticated desktop application shell

## Purpose

Provide a fast, consistent application shell for moving between Career Profile areas and invoking common actions without requiring pointer navigation.

## Desktop shell

The authenticated desktop shell contains:

- collapsible left navigation rail;
- Profile and Professional Focus navigation;
- role-gated Administration navigation;
- bottom account/avatar control;
- global command palette trigger.

Mobile uses the responsive navigation/drawer pattern. Keyboard shortcuts are a desktop enhancement and are not required on touch-only layouts.

## Required keyboard shortcuts

The following shortcuts are hard product requirements:

| Shortcut | Action |
| --- | --- |
| `Cmd+B` on macOS / `Ctrl+B` on Windows/Linux | Toggle the application sidebar between expanded and collapsed states. |
| `Cmd+K` on macOS / `Ctrl+K` on Windows/Linux | Open the global command palette. If the palette is already open, the same shortcut may keep focus in its search input. |
| `Escape` | Close the command palette and return focus to the element that opened it. |
| `Arrow Up` / `Arrow Down` | Move through command-palette results. |
| `Enter` | Activate the highlighted command. |

The UI should display platform-appropriate shortcut hints where useful (`⌘K`/`⌘B` on macOS and `Ctrl K`/`Ctrl B` elsewhere).

## Shortcut interaction rules

- The application handles both `metaKey` and `ctrlKey` variants and prevents the browser's conflicting default behavior when the app shortcut is accepted.
- Shortcuts are active only inside the authenticated application shell.
- Do not open a command palette on top of another blocking dialog/sheet. When a blocking modal owns focus, the modal's keyboard contract wins.
- `Cmd/Ctrl+B` must not be intercepted from a future rich-text/contenteditable control where the application intentionally supports bold formatting. Standard text/password/search inputs do not disable the shell shortcut.
- Shortcut affordances must never be the only way to perform an action. Sidebar controls and the command-palette trigger remain available by pointer and keyboard focus.
- Expose shortcut metadata through accessible names and `aria-keyshortcuts` where the element maps directly to a shortcut.

## Command palette

The command palette is an accessible modal-style overlay with a search input and permission-aware commands. Initial commands include:

### Navigation

- Profile
- Professional Focus
- Account · Profile
- Account · Settings
- Admin · Users — administrators only

### Contextual actions

When the current context permits, include actions such as:

- Add work experience
- Add education
- Add certification
- Edit skills
- Open Resume Tools

Commands that the current user cannot access are omitted rather than shown disabled.

## Command palette states

- closed;
- open with default/recent commands;
- filtered results;
- no matching commands;
- keyboard-highlighted result.

## Sidebar states

- expanded — labels and account details visible;
- collapsed — icons/avatar remain available and expose labels through tooltips/accessible names.

Sidebar collapse changes navigation presentation only; it must not change the active route or lose application state.

## Acceptance criteria

- **APP-AC-001:** `Cmd+B`/`Ctrl+B` toggles the authenticated desktop sidebar between expanded and collapsed states.
- **APP-AC-002:** `Cmd+K`/`Ctrl+K` opens the global command palette and places focus in its search input.
- **APP-AC-003:** Command-palette results support Arrow Up/Down, Enter, and Escape with focus restoration on close.
- **APP-AC-004:** The palette contains only commands available to the current user/role and exposes relevant contextual Profile actions.
- **APP-AC-005:** Shortcut handling prevents conflicting browser defaults only when the application accepts the shortcut and does not override blocking-dialog or rich-text keyboard behavior.
- **APP-AC-006:** Every shortcut action also has a discoverable pointer/focusable UI affordance; shortcuts are accelerators, not exclusive interactions.
- **APP-AC-007:** Expanded/collapsed sidebar state preserves the current route and in-page application state.
- **APP-AC-008:** Shortcut hints use platform-appropriate labels and direct shortcut controls expose accessible shortcut metadata where supported.
