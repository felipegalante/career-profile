# ADR 0007: Server-orchestrated custom catalog values

- Status: Accepted

## Context

Many profile fields can select a global catalog entry or a viewer-private custom value. Persisting custom rows immediately from combobox interactions would create orphan values when dialogs are canceled and would distribute normalization/authorization logic across clients.

## Decision

Represent unsaved custom selections locally in the client and resolve/create viewer-private catalog rows inside the owning application mutation/transaction whenever practical. The server owns normalization, duplicate reuse, ownership checks, parent relationship creation, and final persistence.

## Consequences

- canceled forms do not create unnecessary custom rows;
- authorization/uniqueness lives server-side;
- mutations use a catalog-or-custom selection input pattern;
- dependent selectors need fallback behavior when a selected custom parent has no persisted catalog ID yet.
