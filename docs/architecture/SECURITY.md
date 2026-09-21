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

The simplified project supports an explicit `passwordSetupRequired` state. Admin create/reset operations never accept or expose a plaintext password. Existing sessions are invalidated on reset. Because this project intentionally omits email verification/invitations, production deployment would require a one-time activation or identity-verification mechanism before initial password establishment.
