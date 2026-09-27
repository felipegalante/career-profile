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

When the owning form passes `onCreateCustom` and the search reports no exact visible match, the first option reads:

```text
+ Create custom {noun} “<query>”        Only visible to you
```

Choosing it calls `onCreateCustom(query)`. The owning form either stores an unsaved custom selection (`{ kind: "custom", label }`) or opens a create dialog first; the owning mutation resolves/creates the custom catalog row transactionally. With no results at all, the listbox shows "No catalog matches" and the same action as a keyboard-reachable option.

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

## API

Exported from `@career-profile/ui`:

```ts
<CatalogCombobox
  label="Company"
  value={selection}                // { kind: "catalog", id, label } | { kind: "custom", label } | null
  onChange={setSelection}
  search={(query, { signal, parentContext }) => Promise<{ options, hasExactMatch }>}
  parentContext={companyId}        // dependent fields; a change reruns the search
  onCreateCustom={(query) => …}    // omit to disallow custom values
  customNoun="company"
  placeholder="Search companies…"
  isRequired description errorMessage hideLabel
/>
```

- Options are `{ id, label, meta?, isDisabled? }`; `meta` renders on the right ("Catalog", "At Shopify", "Already added"), and disabled options stay visible.
- The search runs 250 ms after the last keystroke; each query aborts the previous request and stale responses are ignored. `hasExactMatch` comes from the server, which owns normalization.
- The typed text is separate from the selected value: on blur, unfinished text reverts to the selected label and empty text clears the value.
- Loading, no results and failure (with a Retry option) render inside the listbox and are announced.

Do not create separate low-level autocomplete implementations per feature.
