# Capability: Catalog-Backed Profile Selectors

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**
- Routes: **Cross-cutting capability**

## Purpose

Provide one consistent way to search common profile data, select known values, and create a private custom value when the catalog is incomplete. This capability is reused by Skills, Work Experience, Education, Certifications, and Professional Focus.

## Supported behavior

Catalog-backed selectors are for open vocabularies where search quality and custom fallback are useful. Closed product enumerations such as Employment Type, Education Status, and Skill Proficiency remain normal enums/selects and do not offer arbitrary custom values.

A catalog selector supports:

- server-side search;
- normalized matching;
- ranking: exact → prefix → substring → fuzzy similarity;
- default result limit appropriate to a combobox (typically 8–10);
- ~200–300 ms debounce;
- stale-response protection/cancellation;
- match highlighting where useful;
- keyboard navigation and accessible combobox/listbox semantics;
- loading, results, no-results, and error/retry states;
- optional `Create custom "…"` action;
- display of already-selected/invalid options when a feature needs it.

## Custom values

For selectors that permit custom entry:

- global catalog values are visible to all authenticated users;
- a user's custom values are visible only to that user;
- another user's custom values never appear in search or direct lookup;
- normalization/uniqueness is enforced server-side and in the database;
- a custom option should not be offered when an exact normalized visible value already exists;
- weak fuzzy similarity can suggest alternatives but must not silently merge distinct values.

Where practical, custom selections remain local form state until the parent record is saved so canceling a dialog does not create orphan custom catalog rows.

## Dependent selectors

Child fields are hidden until their parent is selected.

- `Company` → `Job Title`
- `Institution` → `Major / Specialization` → `Degree Type`
- `Certification Board` → `Certification / Exam`

When a known parent has curated relationships, related options rank first or are filtered to the relationship. When a custom parent has no curated relationship, the child may fall back to the relevant global vocabulary plus private custom creation where documented by the owning feature.

Changing a parent clears any selected child whose relationship is no longer valid.

## Shared UI component contract

The web implementation should use one shared baseline component (working name: `CatalogCombobox`) rather than separate bespoke autocompletes. Feature wrappers provide labels, query function, parent context, custom-entry policy, and option rendering.

The shared component owns interaction mechanics; feature forms own business rules.

## Shared server behavior

Each domain owns its tables and authorization rules, but normalization/ranking/visibility helpers should be shared. Do not create one polymorphic database table merely to reuse UI behavior.

## Acceptance criteria

- **CAT-AC-001:** All catalog-backed selectors use the standard exact/prefix/substring/fuzzy ranking behavior.
- **CAT-AC-002:** Search is debounced and stale responses never overwrite newer input results.
- **CAT-AC-003:** The combobox is fully operable with keyboard controls and exposes correct accessible state.
- **CAT-AC-004:** Loading, no-results, and request-failure states are visually distinct.
- **CAT-AC-005:** Eligible fields offer custom creation when no exact visible match exists.
- **CAT-AC-006:** User-created custom catalog values are visible to their owner and never returned to other users.
- **CAT-AC-007:** Server/database uniqueness prevents duplicate normalized custom values for the same user/domain scope.
- **CAT-AC-008:** Dependent child fields remain hidden until a valid parent selection exists.
- **CAT-AC-009:** Clearing/changing a parent clears incompatible child selections.
- **CAT-AC-010:** Canceling a form does not leave unnecessary orphan custom catalog values.
