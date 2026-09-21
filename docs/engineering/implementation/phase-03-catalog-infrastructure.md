# Phase 03 — Catalog skill vertical slice

Status: **PLANNED**. Implementation: **Not Started**. This document plans work only. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Deliver a complete catalog skill action: authenticated search, select, save at Intermediate, and reload in Profile. Establish the smallest catalog interaction through this real consumer, not a standalone Company search demo.

## Dependencies

01A and 02A/02B complete. Q08 lexical ranking and identity normalization close before skill seed import. Parent relevance/board rules wait for their consumers in 05–07. Q03 does not block catalog-only manual addition; the resolved dismissal policy arrives in 04C. See slices 03A/03B in [REVIEW_SLICES](REVIEW_SLICES.md).

## Product requirements covered

[Skills](../../product/features/skills.md): SKL-AC-001–006. [Catalog selectors](../../product/features/catalog-backed-selectors.md): first concrete CAT-AC-001–004 implementation. Custom/privacy criteria complete with 04A and owning forms; dependent CAT-AC-008/009 start in 05. No claim that Company or all CAT criteria are complete.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Skills owns its typed search repository and add service. Implement the specified CatalogCombobox interaction surface with only the props needed here. Do not create a generic CatalogSelection service, domain repository hierarchy, dependent-form harness or configurable field engine. Extract common server helpers when a second catalog repository needs the same behavior; preserve explicit domain queries.

## Database work

Create skills, user_skills and MANUAL-only user_skill_sources. Preserve definition origin separately from provenance, unique user/skill and one MANUAL source per association. Add owner checks/partial definition uniqueness now because custom definitions follow in 04. Enable pg_trgm for required fuzzy search and measure the 1,546-skill catalog. Load corrected global skill seeds plus duplicate/concurrency fixtures. No Company table or synthetic owning mutation. Keep typed source extension points described in data contracts without creating future-domain tables.

## GraphQL work

viewer.skills, searchSkills and addSkill with generated operation types. Search requires a viewer, bounded results (default 10, proposed maximum 25), literal wildcard handling and stable ranking. Add input contains only skill ID; ownership comes from session. Return canonical UserSkill with proficiency and MANUAL source. Duplicate add has stable feedback; no category/owner/provenance inputs.

## Backend work

Parameterized exact/prefix/substring/trigram search with stable tie-breaks and visibility predicates. Serialize skill-affecting transactions on the owning user row before ensuring association/MANUAL source; use unique constraints as final duplicate protection. New associations default Intermediate; adding a source never resets existing proficiency. Search does not write. Private create and shared resolution helpers follow 04/05; no test-only persistence route.

## Frontend work

Render Technical/Foundational proficiency lanes, visible/total counts and Show all/fewer; catalog search supports debounce, stale-response protection, keyboard selection, disabled already-added results and distinct loading/no-results/error states. Add and reload show the persisted skill. Build query/cache behavior only for these operations. Slice 03B is a review checkpoint, not a released complete Skills editor; custom/move/remove land in 04.

## Design artifacts

[Skills view](../../design/artifacts/skills/skills.html), [search](../../design/artifacts/skills/skills-search.html), [CatalogCombobox](../../design/artifacts/design-system/components/catalog-combobox.html). Company and dependent-field examples belong to their saving forms in 05–07.

## Accessibility

Labelled combobox/listbox/option semantics, aria-expanded/controls/activedescendant, keyboard Arrow/Enter/Escape/Tab, announced result count/loading/failure, safe custom option label. Escape closes popover before parent dialog; parent replacement resets active option; no focus on vanished descendants.

## Tests

Unit/DB: punctuation-preserving normalization, exact/prefix/substring/fuzzy ordering, limits, concurrent duplicate add, one MANUAL source and preserved existing proficiency. API: anonymous/foreign private ID rejection. Component: reversed responses, debounce, keyboard/Retry, disabled duplicates and count expansion without writes. Browser: search → add → reload in Profile; database records agree. CAT cross-domain completion remains tracked separately.

## Observability

Search duration/result count and safe error class; do not log private raw query labels by default. Compare measured large-catalog query plans, not arbitrary SLA claims. No separate search service.

## Acceptance criteria

SKL-AC-001–006 have concrete runtime evidence; first-consumer CAT-AC-001–004 pass. Search → add → reload is the exit demonstration. No catalog writes on search. No promise of full custom/dependent catalog coverage until 04–08; no synthetic transaction harness stands in for an owning product save.

## Risks

Over-sharing a generic repository, normalization changes after uniqueness, accidental association leaks and stale requests with changed parent. Custom metadata shown in some artifacts must be approved or excluded from input explicitly.

## Human review checkpoint

Review 03A search/read and 03B persisted add independently, including keyboard behavior, canonical count/proficiency and duplicate transactions. Confirm minimal combobox API before a second consumer; shared repository abstractions are not an exit requirement.
