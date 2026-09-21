# Catalog Search Architecture

## Goal

Provide consistent high-quality search across Skills and profile lookup catalogs without duplicating ranking, normalization, visibility, and custom-entry logic in every module.

## Standard ranking

1. normalized exact match
2. prefix match
3. substring match
4. PostgreSQL trigram similarity

Domain-specific relationship relevance can precede weaker lexical matches. Example: for Job Title, a title associated with the selected Company should rank above an equally fuzzy global fallback.

## Standard filters

Every search applies:

- global or viewer-owned visibility;
- active/non-deleted status if introduced;
- parent relationship filters/ranking where applicable;
- bounded result limit.

## Shared implementation

Create typed normalization/ranking SQL helpers and a small shared search utility layer. Keep domain repositories explicit rather than building a single dynamic repository over arbitrary tables.

## Custom values

Custom rows are scoped to the viewer. Owning mutations may resolve a `CatalogSelectionInput` by:

1. validate catalog ID visibility OR normalize custom label;
2. reuse an exact viewer-visible value if one exists;
3. create viewer-private custom row if needed;
4. create any required parent relation;
5. create/update the owning profile record;
6. commit in one transaction.

## Dependent custom parents

A custom parent may not have seeded child relationships. Search can fall back to the domain's global vocabulary while custom child creation remains available. The final save transaction creates viewer-owned relationships as appropriate.
