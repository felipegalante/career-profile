# DataTable

Shared table composition for collections that need server-backed browsing.

## Responsibilities

- search field when appropriate;
- content-specific filters;
- sortable headers or explicit sort selector;
- server-backed pagination and page-size selection;
- result range/total metadata;
- loading/empty/no-results/error states;
- URL/state synchronization where useful.

The Admin Users table uses this component first. Table consumers provide columns, allowed sort keys, filter definitions, and query variables; they do not reimplement pagination/filter mechanics.
