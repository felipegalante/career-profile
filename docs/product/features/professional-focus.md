# Feature: Professional Focus

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**
- Route: `/profile/focus`

## Purpose

Let users describe the professional areas they want their profile to emphasize. This is a flexible profile signal, not a ranked "top five" questionnaire and not a recommendation gate.

## Model

A seeded catalog contains broad focus areas such as Software Engineering, Data & AI, Product, Design, Operations, Security, Finance, Healthcare, Education, and Skilled Trades.

Users may:

- add one or more focus areas;
- add a private custom focus area when needed;
- optionally mark one selected area as `Primary`;
- reorder their selected areas for display.

There is no fixed maximum in the initial release. The UI can provide practical guidance if a user adds an excessive number, but saving is not blocked by an arbitrary top-five rule.

## Interaction

The page uses the shared searchable catalog selector rather than a modal checklist. Selected focus areas render as removable/reorderable items or compact cards. `Set as primary` is available from the selected item's action menu.

## Rules

- duplicate normalized focus areas cannot be selected twice;
- at most one selected focus area is primary;
- removing the primary focus leaves no primary until the user chooses another;
- custom focus values are viewer-private.

## Planned GraphQL

- `focusAreas(search, limit)`
- `viewer.professionalFocus`
- `updateProfessionalFocus(input)`

## Acceptance criteria

- **FOC-AC-001:** User can search and add global focus areas using the standard catalog selector.
- **FOC-AC-002:** User can create a viewer-private custom focus area when no suitable match exists.
- **FOC-AC-003:** User can select any reasonable number of focus areas; there is no hard top-five limit.
- **FOC-AC-004:** User can mark at most one selected focus area as Primary.
- **FOC-AC-005:** User can reorder and remove selected focus areas.
- **FOC-AC-006:** Existing selections and ordering persist across sessions.

## Card presentation

Selected focus areas use neutral surface cards with a category icon. Do not use a decorative colored left border. Primary status is communicated through the explicit `Primary` badge rather than a border accent.
