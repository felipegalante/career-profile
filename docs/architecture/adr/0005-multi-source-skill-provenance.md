# ADR 0005: Multi-source skill provenance

- Status: Accepted
- Date: 2026-09-19

## Context

One user skill can be manually added and also supported by multiple work, education, or certification records. A single source field or broad inferred flag cannot model this without losing information.

## Decision

Represent `UserSkill` separately from one-or-more `UserSkillSource` records. Source type and source reference identify why the skill is present.

## Consequences

- Deleting one profile source can remove only that provenance link.
- One skill remains one profile entry even with several sources.
- Reconciliation/deletion logic must account for source count and ownership.
