# Wireframe: Skills

## View mode: collapsed

```text
Skills                                                   [Edit skills]
Technical and foundational skills grouped by proficiency.

┌─────────────────────────────┐  ┌─────────────────────────────┐
│ Technical                   │  │ Foundational                │
│                             │  │                             │
│ ADVANCED       ●●●          │  │ ADVANCED       ●●●          │
│ No skills                   │  │ No skills                   │
│                             │  │                             │
│ INTERMEDIATE   ●●○          │  │ INTERMEDIATE   ●●○          │
│ Showing 6 of 55             │  │ Showing 4 of 4              │
│ [Java] [SQL] [TypeScript]   │  │ [Teamwork] [Communication]  │
│ [Python] [Git] [Docker]     │  │ [Writing] [Problem Solving] │
│ [Show all 55]               │  │                             │
│                             │  │                             │
│ BEGINNER       ●○○          │  │ BEGINNER       ●○○          │
│ No skills                   │  │ No skills                   │
└─────────────────────────────┘  └─────────────────────────────┘
```

## Expanded lane

`Show all` replaces the preview with all chips and changes to `Show fewer`. `Showing X of Y` describes rendered versus total skills and is never a capacity indicator.

## Edit mode

```text
Edit skills                                                [Done]
Drag skills between levels or use each skill's Move menu.

Technical
ADVANCED
[ Kubernetes  inferred ⓘ  ⋮ × ]

INTERMEDIATE
[ TypeScript  ⋮ × ] [ PostgreSQL ⋮ × ]

BEGINNER
[ Rust        ⋮ × ]

Foundational
...

Add a skill
[ Search the skill catalog____________________________ ]
```

## Search results

```text
[ op_______________________________________________ ]
┌────────────────────────────────────────────────────┐
│ + Create custom skill “op”                         │
├────────────────────────────────────────────────────┤
│ Opinion Writing                                    │
│ Operational Readiness                              │
│ OpenGL                                             │
│ Java                                    Already added│
└────────────────────────────────────────────────────┘
```

Already-added options are disabled.

## Remove control

Every chip in edit mode includes a functional `×` button:

```text
[ TypeScript  ⋮  × ]
                 ↑
          Remove TypeScript
```

The control is independently keyboard-focusable and must not initiate drag. Successful removal updates the lane count immediately and offers Undo; failed persistence restores the chip. When a skill is supported by a source record, removal dismisses it from Skills without changing that record or its provenance.

## Source treatment and inferred details

Skill chips use three distinct, named treatments: manually added catalog, custom, and inferred. The inferred treatment is used when one or more active Work Experience, Education, or Certification records contribute the skill, even if it also has a manual source. Color is not the sole distinction.

```text
[ Kubernetes  Inferred  ⓘ  ⋮ × ]
                    └─ hover, focus, or tap
                       Inferred from
                       • Work Experience: Platform Engineer at Acme
                       • Certification: Certified Kubernetes Administrator
```

`ⓘ` is a focusable details control, not hover-only text. On touch devices it opens the same source-details popover. The visible label and accessible name identify the chip as inferred; the popover lists its contributing source type and record.

## Move menu

```text
Move “TypeScript” to
  Advanced
✓ Intermediate
  Beginner
```

## Feedback

Success toast:

```text
✓ Skill added at Intermediate.                         ×
```

Duplicate/race error:

```text
! This skill is already in your profile.               ×
```

## Category boundary

In edit mode, each skill chip is draggable. The category card is a hard drag boundary:

```text
Technical / Intermediate
[ TypeScript ⋮ × ] ─drag─► Technical / Advanced       ✓
[ TypeScript ⋮ × ] ─drag─► Foundational / Advanced    ✕
```

Dragging changes proficiency only. Technical and Foundational are properties of the skill definition and are never changed by this interaction. Opposite-category lanes should visually indicate that they are unavailable while a chip is being dragged.

The Technical/Foundational total skill badge is vertically centered in the same header row as the category title.

## Drag requirement

Drag-and-drop between proficiency lanes in the same category is a hard product requirement and must be implemented/tested. The `Move to…` menu is the required keyboard-accessible equivalent. Cross-category drops are blocked.
