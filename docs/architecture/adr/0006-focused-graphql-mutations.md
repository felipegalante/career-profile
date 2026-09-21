# ADR 0006: Focused GraphQL mutations

- Status: Accepted
- Date: 2026-09-19

## Context

Replacing an entire profile aggregate to modify one nested record increases client responsibility and lost-update risk.

## Decision

Expose mutations aligned to domain actions: update profile fields, add/update/remove experience, update skill proficiency, and similar focused operations. Do not require the client to resubmit unrelated profile state.

## Consequences

- Clearer authorization and validation boundaries.
- Smaller payloads and reduced accidental overwrite risk.
- More GraphQL operations, but each has narrower semantics.
