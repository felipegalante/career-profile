# Component: CatalogCombobox

## Purpose

One reusable accessible search/select primitive for catalog-backed profile fields. It owns interaction mechanics; owning feature forms supply domain queries, parent context, custom-entry policy, labels, and validation.

## States

```text
CLOSED
FOCUSED_EMPTY
DEBOUNCING
LOADING
RESULTS
NO_RESULTS
ERROR
CUSTOM_SELECTED (local unsaved selection)
```

## Result order

Server returns ordered results using exact → prefix → substring → fuzzy ranking plus domain relationship relevance.

## Custom option

When enabled and no exact visible match exists:

```text
+ Create custom "<query>"
```

Selecting it stores an unsaved custom selection in form state. The owning mutation resolves/creates the custom catalog row transactionally.

## Parent dependencies

A dependent instance is **not rendered** until the parent has a selection. If the parent changes, owning form logic clears incompatible children before rendering the new child state.

## Accessibility

- combobox/listbox/option semantics;
- label programmatically associated;
- Arrow Up/Down moves active option;
- Enter selects;
- Escape closes;
- Tab continues normal form navigation;
- loading/result count/error exposed to assistive technology;
- custom-create option behaves like a normal option.

## Shared props/concepts (implementation guidance, not final API)

```text
label
value
search(query, parentContext)
parentContext?
allowCustom
createCustomLabel(query)
getOptionLabel
onChange
error/helpText
```

Do not create separate low-level autocomplete implementations per feature.
