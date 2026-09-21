# Flow: Derived Skills

```text
Create/update profile source
  (Work Experience | Education | Certification)
        ↓
Resolve reviewed deterministic mapped skills
        ↓
For each mapped global skill:
  attach source provenance automatically
  (no candidate review or confirmation)
        ↓
Ensure one UserSkill per user + skill
        ↓
Source page shows associated-skill preview
Skills page shows one visible profile skill regardless of source count;
inferred chips use their distinct source treatment and expose source details
```

Deleting a source removes only that source's provenance. A user skill remains while another active source still contributes it. Selecting `×` on an inferred or otherwise derived-supported skill dismisses it from the Skills profile without deleting its source facts; later source saves do not restore it. Re-adding it manually clears the dismissal. Deleting the final source removes the orphaned association and its dismissal.
