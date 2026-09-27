# ADR 0012: React Aria Components as the headless accessibility layer

- Status: Accepted
- Date: 2026-09-22

## Context

The shared UI needs modal dialogs with focus trapping and restoration, menus, a select, tabs, tooltips, an asynchronous catalog combobox with custom-entry and retry actions, a filterable command palette, a file drop zone, and pointer drag-and-drop between skill proficiency lanes that rejects drops into the other skill category. Accessibility is part of the definition of done, and each of these patterns has keyboard, focus, and announcement behavior that is easy to get subtly wrong.

The artifact CSS must apply unchanged, which rules out a pre-styled component kit. Mixing several headless libraries would give inconsistent focus and overlay behavior.

## Decision

Use `react-aria-components` as the only headless UI library, pinned with a tilde range so upgrades are deliberate.

- Interactive primitives are built on its Button, Link, TextField, Select, Checkbox, RadioGroup, Tabs, Menu, Popover, Tooltip, Modal/Dialog, ComboBox with `useAsyncList`, Autocomplete, DropZone, and FileTrigger.
- Skill proficiency drag-and-drop uses its `useDrag`/`useDrop` hooks, which run on native HTML drag events for pointer input. The hooks are configured without keyboard drag mode (`hasDragButton`), because the keyboard and assistive-technology path is the skill Move menu. No separate drag-and-drop library is added.
- Its `RouterProvider` connects links and link-like items to the application router, so the shared UI never imports `react-router`.
- Native elements remain in use where they are sufficient, for example `<table>` and headings.
- Toast notifications are implemented in the shared UI package because the library exports its toast API only as `UNSTABLE_` in the 1.21 line.

## Consequences

- Dialogs, overlays, menus, and listboxes share one focus-management and dismissal model, including the order in which Escape closes a combobox popover and then its dialog.
- Component state is exposed through `data-*` attributes, which the CSS Modules target.
- jsdom has no `DragEvent`, so drag behavior is verified in Playwright on Chromium, Firefox, and WebKit; unit tests use `@testing-library/user-event`.
- Library upgrades need a review of deprecated props (for example `selectedKey` in favor of `value` on ComboBox and Select).
- The toast implementation should be revisited once the library's toast API is stable.

## Not covered

Which interactions a feature exposes, and their copy, belong in the product and design specifications.
