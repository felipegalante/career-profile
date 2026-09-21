# Feature: Skills

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**
- Surface: embedded Skills section on `/profile`

## Purpose

Provide a structured Skills profile where users can browse their skills by category/proficiency, add catalog or custom skills, remove skills, and reorganize proficiency.

## Terminology

### Category

```graphql
enum SkillCategory {
  TECHNICAL
  FOUNDATIONAL
}
```

UI labels: **Technical** and **Foundational**.

### Proficiency

```graphql
enum SkillProficiency {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}
```

Newly added skills default to `INTERMEDIATE`.

### Definition origin

```graphql
enum SkillOrigin {
  CATALOG
  CUSTOM
}
```

**Implementation/design note:** the enum is deliberate rather than `isCustom`. It keeps definition type extensible without accumulating boolean flags. Do not put `IMPORTED`, `RECOMMENDED`, or `ASSESSMENT` here: those describe how a skill entered a user's profile and belong to `SkillSourceType`.

### Profile source

Initial source types:

- `MANUAL`
- `WORK_EXPERIENCE`
- `EDUCATION`
- `CERTIFICATION`

A `UserSkill` can have multiple sources.

### Profile presentation source

A visible skill is presented in one of three source treatments: manually added catalog skill, custom skill, or inferred skill. An inferred treatment applies whenever the skill has one or more active Work Experience, Education, or Certification sources; it remains inferred even when it also has a MANUAL source. Color is paired with a visible source label/icon so source is not conveyed by color alone. Inferred skills expose an accessible source-details control: hover shows a tooltip on pointer devices, while keyboard focus and touch open the same content. It names each contributing source type and record (for example, `Work Experience: Senior Developer at Acme`).

## View mode

Skills are grouped first by category and then by proficiency.

Each proficiency lane shows:

- proficiency label/indicator;
- `Showing X of Y` display count;
- skill chips;
- `Show all` / `Show fewer` when the list is truncated.

`X/Y` is a presentation count, never a capacity limit.

View mode does not expose destructive/reorganization controls.

## Edit mode

Edit mode exposes:

- remove control on each skill;
- **required** draggable skill chips with drag-and-drop between proficiency lanes **within the same category only**;
- accessible `Move to…` menu with Beginner/Intermediate/Advanced;
- skill search/add control;
- Done action returning to view mode.

Category movement is not supported through drag/drop: category belongs to the skill definition. A Technical skill can only be dropped into Technical Beginner/Intermediate/Advanced lanes; a Foundational skill can only be dropped into Foundational lanes. Cross-category lanes are invalid drop targets and must never mutate category.

## Skill search/autocomplete

The search box queries the global catalog server-side.

Ranking target:

1. exact match;
2. prefix match;
3. substring match;
4. fuzzy similarity.

Client behavior:

- input updates immediately;
- ~250 ms debounce target;
- stale responses must not replace newer results;
- result count is bounded (initial target 10);
- keyboard arrow navigation, Enter selection, Escape close;
- loading, no-results, and error states are distinct;
- already-added skills render disabled with `Already added` rather than relying only on a failed mutation.

## Custom skill creation

When the query is nonblank and no exact normalized catalog/current-user custom match exists, offer:

`Create custom skill “{query}”`

The client submits the label only. The server orchestrates:

1. normalization;
2. duplicate detection;
3. category classification/fallback;
4. custom definition creation when needed;
5. `UserSkill` association;
6. default Intermediate proficiency;
7. MANUAL source creation.

The server returns the resulting `UserSkill` atomically.

## Duplicate behavior

- frontend disables known already-added results;
- backend/database remain authoritative against concurrent duplicate attempts;
- duplicate mutation errors surface specific feedback such as `This skill is already in your profile.`

## Removal behavior

Every editable skill chip exposes a visible `×` remove control.

Interaction requirements:

- selecting `×` removes that skill from the user's profile according to provenance rules;
- the `×` is an actual focusable button with an accessible label such as `Remove TypeScript`;
- activating the remove control must not start or interfere with drag-and-drop;
- the UI removes the chip immediately when optimistic mutation behavior is used, updates lane counts, and shows success feedback;
- if persistence fails, the chip and previous counts are restored and an error toast is shown;
- keyboard users can reach and activate the remove control without using drag-and-drop.

Removing a manually added skill with no active derived source deletes the profile association. Removing an inferred skill, or a skill that still has active derived sources, persists a per-user dismissal: the skill immediately disappears from the Skills profile, but its Work Experience, Education, and Certification source facts and links remain intact. Saving or editing a contributing source must not restore a dismissed skill. Re-adding the skill through the normal catalog search clears the dismissal and restores it as a manually added skill. Deleting the final source removes the now-orphaned association and any dismissal. Removal uses an immediate, reversible `Undo` toast; failed persistence restores the chip and its previous counts.

Reviewed deterministic mappings attach inferred skills automatically whenever a Work Experience, Education, or Certification record is created or updated. There is no candidate-review or per-skill confirmation step in the initial release.

## Feedback

Success examples:

- `Skill added at Intermediate`
- `Skill moved to Advanced`
- `Skill removed`

Error examples:

- `This skill is already in your profile.`
- `Unable to update proficiency. Your previous value was restored.`

## Planned GraphQL

- `viewer.skills`
- `searchSkills(input)`
- `addSkill(skillId)`
- `addCustomSkill(label)`
- `removeSkill(userSkillId)`
- `restoreSkill(userSkillId)`
- `updateSkillProficiency(userSkillId, proficiency)`

## Search/persistence implementation notes

- global skill catalog seed target: 1,000–3,000 entries;
- normalized labels support exact/duplicate detection;
- PostgreSQL `pg_trgm` supports fuzzy matching under ADR 0008;
- custom definitions are private to the owner;
- `user_skills` has a unique `(user_id, skill_id)` constraint.

## Acceptance criteria

- **SKL-AC-001:** Skills display under Technical/Foundational and Beginner/Intermediate/Advanced.
- **SKL-AC-002:** Collapsed lanes display `Showing X of Y` and can expand/collapse without changing domain data.
- **SKL-AC-003:** User can search the catalog with exact/prefix/substring/fuzzy behavior and bounded results.
- **SKL-AC-004:** Search supports keyboard navigation and distinct loading/no-result/error states.
- **SKL-AC-005:** Already-added search results are visibly disabled and backend duplicate protection remains authoritative.
- **SKL-AC-006:** User can add a catalog skill and it defaults to Intermediate.
- **SKL-AC-007:** User can create a custom skill when no exact normalized existing definition is appropriate.
- **SKL-AC-008:** Custom skill creation is atomic and prevents normalized duplicates for the user.
- **SKL-AC-009:** User can remove a skill subject to provenance rules: derived-supported skills are dismissed from the profile without losing their sources, re-adding clears dismissal, and final-source removal deletes the association.
- **SKL-AC-010:** Drag-and-drop is implemented as a required interaction: user can move a skill between proficiency levels by dragging the chip. A keyboard-accessible `Move to…` menu provides the equivalent non-pointer path.
- **SKL-AC-011:** Failed optimistic proficiency changes roll back and surface feedback.
- **SKL-AC-012:** Category is definition-owned. Dragging a Technical skill exposes only Technical proficiency lanes as valid drop targets; dragging a Foundational skill exposes only Foundational lanes. Cross-category drops are blocked and the Move menu changes proficiency only.
- **SKL-AC-013:** Custom skills belonging to one user never appear in another user's catalog/search/profile.
- **SKL-AC-014:** A skill can retain multiple provenance sources without duplicate profile entries; reviewed source mappings attach automatically on source save.
- **SKL-AC-015:** Every skill chip in edit mode has a functional, keyboard-focusable `×` remove button. Activating it invokes the remove-skill behavior, updates the rendered lane/counts, and does not initiate dragging.
- **SKL-AC-016:** If skill removal persistence fails after an optimistic update, the removed chip and previous counts are restored and an error toast is displayed.
- **SKL-AC-017:** Manual catalog, custom, and inferred skills have distinct source treatments. Inferred chips provide their contributing Work Experience, Education, and/or Certification records through an accessible hover/focus/touch source-details control.

## Section header alignment

Technical and Foundational category headers use a consistent flex row. The total-count badge (for example `15 skills`) is vertically centered with the category title and must not float above/below the heading baseline.
