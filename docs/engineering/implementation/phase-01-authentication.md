# Phase 01 — Authentication and account states

Status: **IN PROGRESS**. Implement as independently reviewable 01A and 01B slices. Read the [readiness decisions](../reviews/architecture-readiness.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), and [coverage matrix](COVERAGE.md) with the owning feature specifications.

## Objective

Deliver secure register/sign-in/sign-out and approved first/reset-password establishment, preserving onboarding as an independent state.

## Dependencies

00 complete. The rendered indigo/Geist tokens are the auth visual authority. 01A delivers registration/login/logout and guarded routing; 01B uses approved admin-issued, trusted-channel one-use setup links for setup/reset lifecycle. No email-only password establishment. No SSO/email verification/MFA expansion.

## Product requirements covered

[Authentication](../../product/features/authentication.md): AUTH-AC-001–008. Credential state semantics support ADM-AC-003/004/006; actual admin creation/reset operations and UI wait for 10. ONB-AC-001 guard foundation; required-fields completion arrives in 02C; full optional-domain journey closes in 09.

## Technical design

Review the independent units in [REVIEW_SLICES](REVIEW_SLICES.md) before scheduling this milestone; it is not one implementation PR.

Auth services own credential verification/session issuance. Thin resolvers call them. Request context resolves opaque server sessions. A setup grant has limited authority and cannot access arbitrary viewer data. Use approved Argon2id password envelope and async hashing. Credentials, setup-required and onboarding-completed fields remain separate.

## Database work

Create users, sessions, base user_profiles keyed by user_id, conditional password_setup_grants; admin audit rows and issuing-actor support arrive with Admin in 10. Unique normalized email/token hashes, user FKs, expiry/revocation and credential generation. Enforce consistent hash/setup shape. Registration creates USER/profile/session atomically. Setup consumes proof and sets hash/session in one transaction; credential invalidation locks account, increments generation and revokes password/sessions/grants without changing onboarding; Admin invokes that lifecycle in 10. Seed hashed dev admin/user plus passwordless and reset fixtures safely.

## GraphQL work

Queries: viewer nullable with role/setup/onboarding status. Mutations: register(input email/password), login(input), logout, setPassword(input proof/password). Client confirm-password is UI validation; server always enforces password policy. Auth outcome only reveals setup after valid proof. Stable generic login/grant error, DUPLICATE_EMAIL, VALIDATION_FAILED, RATE_LIMITED. Grant consumption/revocation can be tested now using controlled fixtures; public admin operations/UI arrive with their actual consumer in 10. Do not implement admin account-management services ahead of 10 merely to construct fixtures.

## Backend work

Implement email normalization, ten-character mixed-class policy already specified, upper bound to prevent hash abuse, session repository and cookie hooks. Public input cannot choose ADMIN. Enforce CSRF/Origin, cookie scope/Secure/SameSite, throttles across aliases, logout invalidation, credential-generation race checks, request redaction. Incomplete accounts may use only onboarding-authorized operations. Profile fields follow in 02; do not ship a route-guard bypass.

## Frontend work

Routes /login, /register, /set-password (in `web/src/features/auth`, composed from `@career-profile/ui` and checked against the auth artifacts by `web/e2e/auth-parity.spec.ts`) with shared auth illustration, auth-scoped field/error controls, PasswordInput, field errors, pending/disabled submission and network retry preserving safe form state. Route established sessions according to onboarding state. Introduce client operation generation and a typed fetch wrapper here. Keep viewer/session state small; a cache library is not required for login alone. Clear any private state on logout/account change and cancel old requests. Add route loading/error boundary and direct-link handling. No password/token persistence in localStorage.

## Design artifacts

[Login](../../design/artifacts/auth/login.html), [login error](../../design/artifacts/auth/login-error.html), [register](../../design/artifacts/auth/register.html), [register validation](../../design/artifacts/auth/register-errors.html), [set password](../../design/artifacts/auth/set-password.html). Add approved grant-invalid/expired/replayed and reset-completed-user variants before acceptance; current setup artifact alone is insufficient.

## Accessibility

Programmatic labels, autocomplete=username/current-password/new-password, focus error summary/first invalid field appropriately, independent eye buttons, paste/password-manager support, loading announcement and desktop/mobile illustration continuity. No sensitive value in announcements.

## Tests

Unit: policy/normalization/expiry. DB: email collision, grant consumption and reset/login races. GraphQL: tampered role, bad proof/replay, CSRF, viewer/logout and session revocation. UI: matching confirmation, toggle, pending/retry and route results. Browser: cookie lifecycle and setup with incomplete vs complete onboarding; end-to-end full onboarding is explicitly pending 09.

## Observability

Safe authentication outcome/latency and throttling counters; Admin create/reset audit arrives in 10 without secrets. Log request ID, not password/grant payload. Alerting infrastructure is not required to prove the flow.

## Acceptance criteria

AUTH-AC-001–007 pass at API/UI as applicable; AUTH-AC-008 route decision passes with complete/incomplete fixtures. Invalid proof cannot establish credentials. Reset preserves completion and revokes existing sessions even with concurrent login. Public registration only creates USER; no unguarded normal route for incomplete users.

## Risks

Q01 approval is mandatory. Grant delivery is a product/security concern, not solved by hiding a button. Sessions could be restored by an in-flight login unless generation is rechecked. Account enum/profile fixture combinations must be explicit.

## Human review checkpoint

Review threat model, proof lifecycle, transactional reset tests, cookie behavior and all auth states. Product confirms reset does not repeat onboarding. Review 01A independently to unlock Profile work; 01B remains blocked until Q01 is settled.
