# Codex Workflow

## Project-local configuration

```text
AGENTS.md
api/AGENTS.md
web/AGENTS.md
db/AGENTS.md
.codex/config.toml
.codex/agents/*.toml
.agents/skills/*/SKILL.md
```

## Before planning/implementation

For a feature, read:

1. `docs/product/PRD.md`
2. the relevant `docs/product/features/<feature>.md`
3. `docs/product/FEATURE_STATUS.md`
4. `docs/product/features/catalog-backed-selectors.md` when the feature contains catalog-backed fields
5. the relevant wireframe/flow
6. architecture docs + only the ADRs that apply
7. current implementation phase

Do not infer product requirements from ADRs.

## Planning prompt

> Use the plan-feature workflow. Read the feature spec, page inventory, relevant wireframe/flow, architecture docs, and applicable ADRs. Identify confirmed requirements, acceptance criteria, impacted contracts/data, and open questions. Update planning docs only and stop before implementation.

## Implementation prompt

> Implement Phase N / acceptance criteria X only. Use database/backend/frontend specialists as appropriate, then have qa_reviewer compare the result against the feature acceptance criteria and traceability matrix. Do not start the next phase.

## Review prompt

> Review this branch against the exact feature acceptance criteria and accepted technical ADRs. Prioritize correctness, authorization, data integrity, accessibility, race conditions, and missing tests.

## Documentation changes

- Product behavior change → feature spec + status/page inventory if applicable.
- UX/page change → feature spec + wireframe/flow/design spec.
- Technical architecture change → architecture docs and ADR only when the decision has broad/lasting technical consequences.
- Implementation sequencing change → implementation plan/traceability.

Do not create ADRs for ordinary acceptance criteria or UI details.
