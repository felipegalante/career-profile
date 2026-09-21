# Feature Pattern: Data Tables

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**

## Purpose

Provide a reusable server-backed table pattern for administrative and future high-volume collections.

## Required capabilities

Every product table must define content-appropriate:

- pagination;
- page size selection;
- total-result count/range;
- sorting;
- filters;
- free-text search when the displayed data is naturally searchable;
- loading, empty, error, and no-filter-match states.

Do not implement pagination, filters, and sorting independently per screen. Use a shared `DataTable`/table-controller pattern.

## Admin Users table

Search:
- name;
- email.

Filters:
- role (`USER`, `ADMIN`);
- onboarding status (`COMPLETE`, `INCOMPLETE`).

Sorting:
- user/name;
- role when useful;
- onboarding status when useful;
- created date.

Default sort: newest created first.

Pagination must be server-backed. The URL or table state should preserve page, page size, search, filters, and sort sufficiently for deterministic reload/navigation.

## Accessibility

- sortable headers expose their sort state;
- filter controls are labeled;
- pagination controls have accessible names and disabled state;
- keyboard interaction does not require a pointer.

## Acceptance criteria

- **TBL-AC-001:** Every data table has pagination with range/total information and next/previous or page controls.
- **TBL-AC-002:** Every data table provides filters appropriate to its displayed fields.
- **TBL-AC-003:** Sortable data is exposed through explicit sort controls and server query inputs.
- **TBL-AC-004:** Search/filter/sort changes reset pagination to a valid page.
- **TBL-AC-005:** Loading, empty, no-results, and error states are intentional.
- **TBL-AC-006:** The Admin Users table supports name/email search, role filter, onboarding filter, and created/name sorting.
