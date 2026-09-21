# Feature: Admin User Management

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**
- Route: `/admin/users`

## Purpose

Allow administrators to find accounts, create users/admins, and force password reset while preserving server-side authorization.

## User table

Columns:

- user (name + email);
- role;
- onboarding status;
- created date;
- actions.

The table uses the shared [Data Tables](data-tables.md) pattern with server-backed pagination, page size, name/email search, role/onboarding filters, and sorting. The search control expands across available toolbar space until the filter group, and filter/sort controls use the borderless neutral style defined by the design system. The page has **one** `Create user` action in the page header; do not duplicate it inside the table toolbar.

## Create user

Fields:

- optional first name;
- optional last name;
- email;
- role (`USER` or `ADMIN`).

The admin does **not** assign a password. The account is created with:

- `passwordSetupRequired = true`;
- onboarding status `INCOMPLETE` / `onboardingCompletedAt = null`.

On first access, the user must set a strong password and then proceeds through onboarding.

## Reset password

An admin can reset any user's password. Resetting:

- invalidates the current password and active sessions as appropriate;
- sets `passwordSetupRequired = true`;
- requires password setup at the next sign-in;
- does **not** change a previously completed onboarding state.

## Authorization

Backend authorization is authoritative; hiding Admin UI is not sufficient.

## Planned GraphQL

- `adminUsers(input: AdminUserListInput!): AdminUserConnection!`
- `adminCreateUser(input: AdminCreateUserInput!): User!`
- `adminResetPassword(userId: ID!): AdminResetPasswordPayload!`

## Acceptance criteria

- **ADM-AC-001:** Admin can view users through a paginated, searchable, filterable, sortable table.
- **ADM-AC-002:** Regular users cannot access the admin route or operations.
- **ADM-AC-003:** Admin can create USER or ADMIN accounts without assigning a password.
- **ADM-AC-004:** A newly admin-created account is onboarding-incomplete and must set its password on first access.
- **ADM-AC-005:** Only one Create User action is rendered on the Users page.
- **ADM-AC-006:** Admin can reset a user's password, forcing password setup on the next sign-in without resetting completed onboarding.
- **ADM-AC-007:** Duplicate/invalid email rules are enforced server-side.
