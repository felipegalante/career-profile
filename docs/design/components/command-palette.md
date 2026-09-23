# CommandPalette

Shared authenticated-shell overlay opened by `Cmd+K` / `Ctrl+K` or its visible trigger.

## Anatomy

```text
CommandPalette
├── search input
├── command groups
│   ├── Navigation
│   └── Contextual actions
├── active command row
└── keyboard-help footer
```

## Interaction

- opening moves focus into the search input;
- Arrow Up/Down changes the active command;
- Enter activates the active command;
- Escape closes and restores focus to the invoking control;
- text input filters commands client-side from the already-authorized command registry;
- no-results state explains that no commands match;
- blocking dialogs prevent the palette from opening on top of them.

## Commands

The application builds the command list for the current user and page and passes it to `AppShell` as `commands` (the palette is also exported as `CommandPalette`). Each command provides:

- stable `id`;
- `label` and optional `description`;
- `group` (sections keep first-seen order, for example Navigation then Profile actions);
- `icon`;
- `href` for navigation or `onAction` for an action.

Role and context filtering happens before the list reaches the shell: do not pass commands the current user is unauthorized to execute. The first command is active on open; running a command closes the palette.

## Shortcut presentation

Use the compact `kbd` primitive. Display `⌘ K` on macOS and `Ctrl K` on Windows/Linux. The visible palette trigger exposes `aria-keyshortcuts` for both Meta and Control variants.

## Accessibility

Implement as a modal-style accessible overlay with a labelled search field, deterministic active-option semantics, focus restoration, and no pointer-only actions. Shortcuts accelerate existing actions rather than creating shortcut-only capabilities.
