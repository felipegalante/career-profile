# Feature: Authentication

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**
- Routes: `/login`, `/register`, `/set-password`

## Purpose

Provide intentionally simple email/password authentication for regular users and administrators.

## Public registration

Fields:

- Email
- Password
- Verify password

Password and Verify Password use the shared `PasswordInput`, including a trailing eye control to show/hide the entered value.

Validation:

- valid normalized unique email;
- minimum 10 characters;
- uppercase, lowercase, number, special character;
- verify password must match.

Public registration always creates a `USER`.

## Login

Fields:

- Email
- Password with show/hide eye control.

Invalid credentials use a generic response.

## Admin-created accounts and first password setup

Admin-created users have no initial password hash and are marked `passwordSetupRequired = true`. An administrator issues a high-entropy, short-lived, one-use setup link through an approved trusted channel; only a keyed hash of that proof is stored. Sign-in does not reveal setup-required status and continues to return the generic invalid-credentials response. The setup link opens `/set-password` and the user creates and verifies a strong password, after which:

- `passwordSetupRequired` becomes false;
- a session is established/continued;
- if onboarding is incomplete, the user proceeds to onboarding.

This intentionally simple project flow does not include email delivery or verification. The trusted channel is an admin operation delivered with Admin Users; it is not a public recovery or email-verification flow.

## Admin password reset

Admin reset returns the account to `passwordSetupRequired = true` and invalidates credentials/sessions as defined by the security implementation. It does not automatically change onboarding completion.

## Session behavior

- server-managed session;
- HttpOnly cookie;
- logout invalidates current session;
- authenticated operations resolve `viewer`.

## Acceptance criteria

- **AUTH-AC-001:** Public registration validates email and strong matching passwords.
- **AUTH-AC-002:** Every password input provides an accessible show/hide control.
- **AUTH-AC-003:** Public registration cannot create an admin.
- **AUTH-AC-004:** Valid credentials establish a session and invalid credentials do not disclose account existence.
- **AUTH-AC-005:** Admin-created accounts can complete first-password setup before onboarding.
- **AUTH-AC-006:** Password-reset accounts are required to establish a new password at next access.
- **AUTH-AC-007:** Logout invalidates the active session.
- **AUTH-AC-008:** After authentication/password setup, incomplete onboarding routes to onboarding and completed users route to `/profile`.

## Authentication presentation

On desktop, Sign In, Create Account, and Set Password use the same supporting visual that demonstrates how Experience, Education, and Certification records connect to the Skills profile. It communicates product utility rather than account-state explanations or decorative profile-count cards.


## Registration presentation

The registration screen uses the same desktop supporting product illustration as Sign In: experience, education, and certification records visually connect into a Skills profile. Do not replace it with profile counters or completion marketing cards.

The registration form does not display implementation-policy helper copy such as “No email verification is required.” Validation guidance belongs beside the specific fields that need it.
