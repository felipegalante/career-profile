# Component: ProfileRecordDialog

## Purpose

Provide a consistent modal/sheet shell for Work Experience, Education, and Certification create/edit forms without forcing those forms into one generic schema.

## Baseline behavior

- title + close button;
- accessible focus trap and return-to-trigger;
- scrollable form body when needed;
- consistent field spacing/help/error layout;
- Cancel + primary Save footer;
- Save loading state prevents duplicate submission;
- Escape/close allowed when safe;
- failed save preserves form values;
- responsive near-full-screen sheet on small devices.

## Composition

The shell provides structure only. Each feature owns field order, validation, catalog dependencies, and mutation input.
