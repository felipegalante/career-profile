# Flow: Catalog Selection

## Standard selector

```text
Focus input
  → type query
  → debounce
  → server search
  → exact / prefix / substring / fuzzy ranked results
       ├─ select global result
       ├─ select viewer-private custom result
       └─ Create custom "query" (when allowed and no exact match)
  → selected value stored in form state
```

A custom value remains local form state until the owning record is saved whenever practical.

## Dependent selector

```text
Parent not selected
  → child field not rendered

Parent selected
  → child field appears
  → parent context sent with search
  → known relationship results rank/filter first
  → fallback/global/custom path remains available when allowed

Parent changes
  → incompatible child selection cleared
  → child search resets for new parent context
```

## Save

```text
Submit profile record
  → validate known catalog IDs are viewer-visible
  → normalize/reuse/create custom selections in one transaction
  → create required parent-child associations
  → create/update profile record
  → return canonical saved values
```
