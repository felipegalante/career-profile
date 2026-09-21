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

## Command registry

The shell owns a permission-aware registry. Commands may provide:

- stable command id;
- label;
- optional description;
- group;
- icon;
- navigation destination or action callback;
- visibility predicate based on role/current context;
- optional shortcut hint.

Do not render commands the current user is unauthorized to execute.

## Shortcut presentation

Use the compact `kbd` primitive. Display `⌘K` on macOS and `Ctrl K` on Windows/Linux. The visible palette trigger exposes `aria-keyshortcuts` for both Meta and Control variants.

## Accessibility

Implement as a modal-style accessible overlay with a labelled search field, deterministic active-option semantics, focus restoration, and no pointer-only actions. Shortcuts accelerate existing actions rather than creating shortcut-only capabilities.
