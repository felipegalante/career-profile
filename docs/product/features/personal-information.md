# Feature: Personal Information

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**
- Surface: Account page → `Profile` tab

## Purpose

Allow users to review and maintain the core personal/career-context fields used across their profile.

## Fields

- first name (required);
- last name (required);
- phone number (optional);
- date of birth (optional);
- location/city (optional);
- postal code (optional);
- country (required after onboarding);
- preferred language (required after onboarding);
- LinkedIn URL (optional);
- employment status (optional);
- career goal (optional).

The initial product intentionally does not collect ethnicity, community membership, or gender identity.

## Modes

### Read view

Display profile values in grouped sections:

- Identity
- Location/contact
- Career context

Missing optional values render `Not provided` or equivalent neutral copy.

### Edit view

One accessible form with Save and Cancel. Cancel does not persist local changes.

## Validation

- names cannot be whitespace-only;
- LinkedIn URL, when supplied, must be a valid URL;
- date of birth cannot be in the future;
- country/preferred language must be valid supported values.

## Planned GraphQL

- loaded through `viewer.profile`;
- `updateProfile(input)` for current user.

## Acceptance criteria

- **PER-AC-001:** User can view all supported personal fields with clear handling of missing optional values.
- **PER-AC-002:** User can edit and save supported fields.
- **PER-AC-003:** Cancel discards unsaved local changes.
- **PER-AC-004:** Invalid date/URL/required fields are rejected with field-level feedback.
- **PER-AC-005:** A user cannot update another user's profile through self-service operations.

## Navigation

Personal information is not a primary navigation item. Users open the bottom avatar/account menu and choose `Profile`. `Profile` and `Settings` are tabs on the same Account page.
