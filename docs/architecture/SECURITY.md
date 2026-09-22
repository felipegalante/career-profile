# Security Plan

## Authentication

Use email/password credentials and server-managed sessions under ADR 0003.

Passwords:

- never log/store plaintext;
- use a modern password hash suitable for Node (final library/parameters chosen during Phase 1);
- enforce server-side password policy;
- generic invalid-login response.

Sessions:

- HttpOnly cookie;
- Secure in production;
- appropriate SameSite setting;
- expiry and server-side invalidation;
- rotate/replace session on authentication boundary as appropriate.

Phase 01 sessions have a seven-day absolute lifetime and a 24-hour idle timeout. They use host-only `Path=/`, `SameSite=Lax` cookies, `HttpOnly` session cookies, `Secure` outside local HTTP, and a session-bound double-submit CSRF token. Cookie-authenticated mutations require the trusted Origin, the non-simple client header, and the matching CSRF token.

## Authorization

- self-service profile operations derive user identity from session/context;
- ownership is verified server-side for entity IDs;
- admin operations require `ADMIN` independent of UI visibility;
- public registration cannot accept/set role.

## Input handling

- GraphQL validation + application validation;
- Drizzle parameterization/SQL placeholders only;
- never concatenate untrusted search strings into SQL;
- normalize email/skill labels in a single shared implementation;
- validate URLs/dates/enums server-side.

## GraphQL transport

- the foundation API accepts JSON POST requests only; batching and multipart requests are disabled;
- same-origin hosting is the default and credentialed CORS remains disabled;
- Phase 01 must validate trusted Origin and add a session-bound CSRF defense before cookie-authenticated mutations are enabled;
- Fastify applies a 1 MiB body limit; depth, alias, execution, and statement limits are measured against real Profile operations before authenticated exposure;
- request logs include a generated request ID, operation name, duration, and safe error code only. Cookies, authorization, passwords, grants, database URLs, and sensitive GraphQL variables are redacted or omitted.

## Data privacy

User custom skills and profile records are private to their owner in initial scope. Search must not accidentally combine custom skills across users.

## Resume future work

Before resume implementation, define:

- accepted MIME/size;
- malware/content scanning strategy if required;
- object-storage access controls;
- retention/deletion;
- model/provider data handling;
- generated-artifact access controls.

## Admin-created/reset accounts

The simplified project supports an explicit `passwordSetupRequired` state. Admin create/reset operations never accept or expose a plaintext password. Existing sessions are invalidated on reset. Password establishment requires an administrator-issued, high-entropy, short-lived, one-use setup link delivered through an approved trusted channel. The raw proof is placed in the link fragment, removed from browser history on load, never logged or persisted in browser storage, and stored server-side only as a keyed hash.
