# Phase 04 — Skills and provenance core

Status: **PLANNED**. Implementation: **Not Started**. This document plans work only. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Extend the persisted catalog-skill slice with custom creation, proficiency changes, required drag/Move, and truthful removal. Review these as 04A–04C, each with its own tests and onboarding integration.

## Dependencies

03 complete. Q03 gates only custom slice 04A. The resolved dismissal/automatic-mapping policy defines removal slice 04C and derived domains; proficiency slice 04B can proceed independently. Approve the drag integration spike before adding its package.

## Product requirements covered

[Skills](../../product/features/skills.md) SKL-AC-001–016, CAT-AC-001–010 as applicable, PRO-AC-002 Skills slice. SKL-AC-014 multiple derived sources completes with 05–07; source-shape/uniqueness foundation is required now.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Skill definitions carry origin/category; UserSkill carries proficiency; source records carry MANUAL/derived provenance. Server resolves addCustomSkill(label) atomically under approved classifier; UI does not supply ownership/category. Introduce only MANUAL operations now; typed source attachment starts with Work in 05. Extract shared reconciliation only once Education provides the second concrete derived consumer. No AI/recommendation system.

## Database work

Extend the skills/user_skills/MANUAL sources created in 03; do not recreate or reseed a second ownership model. Initial source shape permits MANUAL; add typed source FK alternatives as domains arrive, never unvalidated arbitrary source UUIDs. Default INTERMEDIATE only for new association; preserve existing proficiency. Reuse global seeds from 03; add private duplicate/collision fixtures and any justified new migration.

## GraphQL work

Reuse viewer.skills/searchSkills/addSkill from 03; add addCustomSkill(input label); updateSkillProficiency(id, proficiency, expectedRevision); removeSkill(id) with canonical `REMOVED`/`DISMISSED` outcome and restoreSkill(id) for Undo. Reject duplicate profile association, private definition, foreign UserSkill and category mutation. Map normalized races to stable feedback.

## Backend work

Services own classification, duplicate detection, defaulting, MANUAL source and provenance-aware removal. Lock the owning user before skill writes; check revision for optimistic proficiency updates and coordinate source count. Do not prebuild a reconciliation strategy framework. Success outcomes must match actual retained/removed state; no source fact is silently discarded.

## Frontend work

Embed Technical/Foundational cards and Beginner/Intermediate/Advanced lanes; collapsed visible/total counts, show all/fewer, edit/Done. Use shared search/custom. Show distinct named manual-catalog, custom, and inferred chip treatments; inferred chips have a focusable source-details control that works by hover, focus and touch. Real pointer/touch drag is only within category plus dedicated Move menu; independent focusable × never starts drag. Optimistic move snapshots only affected records/counts; manual-only removal deletes the association, while inferred/derived-supported removal persists dismissal and immediately hides the chip. Offer Undo, rollback safely on persistence failure and reconcile canonical state. View mode has no destructive controls. Onboarding manual selection × must remove immediately and restore chip/counts on failure (ONB-AC-008/SKL-AC-016). Do not build a generic rollback framework.

## Design artifacts

[Skills view](../../design/artifacts/skills/skills.html), [expanded](../../design/artifacts/skills/skills-expanded.html), [edit](../../design/artifacts/skills/skills-edit.html), [search](../../design/artifacts/skills/skills-search.html), [custom](../../design/artifacts/skills/skills-custom.html), [feedback](../../design/artifacts/skills/skills-feedback.html), [components](../../design/artifacts/design-system/components/skills.html). Add actual per-chip Move and provenance-retained/error/undo states; correct undefined drag token and stale mobile nav.

## Accessibility

Accessible named drag activator, Move, Remove and inferred-source-details buttons; keyboard menu targets proficiency only. Announce pickup/drop/cancel/result; preserve focus after deletion/movement/rollback. Ensure touch scrolling and drag thresholds coexist; adequate × target spacing; no nested buttons. Color is paired with named source treatment. Screen reader hears counts without repeated toast/live-region duplication.

## Tests

Unit: approved classifier and source lifecycle; DB: private uniqueness, concurrent add, MANUAL uniqueness, dismissal lifecycle and revision conflict. API: no category writes/foreign ownership. UI: all SKL criteria including partial lanes/counts, stale failures, remove during drag, dismissal/Undo and inferred source details. Browser: real pointer drop, cross-category rejection, keyboard Move, keyboard ×, hover/focus/touch source details and rollback. Multi-source end-to-end added in source phases.

## Observability

Safe add/move/remove outcome counts and errors, duplicate conflicts, latency; no raw custom skill strings in telemetry. No separate event system.

## Acceptance criteria

Combined 03/04 evidence demonstrates SKL-AC-001–013/015–017; source core is ready for 014, which cannot be complete until the actual source domains pass. New skills Intermediate; counts reflect visible/total; cross-category drop sends no mutation; failed operations restore correct canonical state; × removes or dismisses under the approved provenance policy with Undo recovery.

## Risks

Classifier ambiguity, older failed mutation undoing a newer success, DOM-only drag demonstration mistaken for persistence, lost source data and focus after removal.

## Human review checkpoint

Product reviews multi-source removal outcome/classification; design/QA reviews actual pointer and keyboard workflows and rollback. Engineering approves source FK extension design before 05.
