# Flow: Skills Management

```text
Skills view
  ├─ Show all / Show fewer
  └─ Edit skills
       ├─ Search catalog
       │    ├─ choose available catalog skill
       │    │    → add at Intermediate
       │    │    → success feedback
       │    ├─ result already added
       │    │    → disabled + Already added
       │    └─ no suitable exact match
       │         → Create custom skill
       │         → server normalize/classify/create/associate
       │         → add at Intermediate
       ├─ Move skill
       │    ├─ drag chip within its existing category only
       │    │    → opposite category is not a valid drop target
       │    └─ Move menu (proficiency destinations only)
       │         → optimistic update
       │         → success OR rollback/error
       ├─ Remove skill
       │    ├─ manual-only → remove association
       │    └─ inferred/derived-supported → dismiss from Skills, preserve sources
       │         → immediate Undo OR persistence rollback/error
       └─ Done
            → Skills view
```
