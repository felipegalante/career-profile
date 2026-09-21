# Feature: Onboarding

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**
- Route: `/onboarding`

## Purpose

Collect enough profile context to make the application useful while allowing users to skip nonessential sections.

## Flow

1. Personal details
2. Career context
3. Optional work experience
4. Optional education/certification foundation
5. Professional Focus
6. Initial skills
7. Complete

Onboarding reuses the same persistent profile models and shared catalog selectors as the normal profile pages.

## Step details

### Personal details

Required: first name, last name, country, preferred language.
Optional: phone number, date of birth, city/location, postal code, LinkedIn URL.

### Career context

Optional: employment status and career goal.

### Work experience

Optional. Uses Company → Job Title dependent catalog selectors.

### Education / Certifications

Optional. Uses the same dependent selectors as the normal Education & Certifications page.

### Professional Focus

Optional. User may add any relevant focus areas and optionally mark one primary, or skip.

### Skills

Optional. Added skills default to `INTERMEDIATE`. Selected skills render as removable chips; each chip's `×` control must immediately remove that selection from the onboarding step and remain keyboard accessible.


## Layout and visual continuity

Onboarding uses the same two-panel public/authentication shell as Sign In and Create Account.

- the form/step content appears in the left panel;
- the right panel consistently presents the `Connect the parts of your professional story.` product illustration;
- the right-side illustration remains consistent across onboarding steps so the flow feels connected to account creation rather than like a separate product surface;
- on narrow/mobile layouts the illustration may collapse below or be hidden according to the responsive design-system rules.

## Product rules

- There is no separate onboarding data store.
- Completion is explicit through `onboardingCompletedAt`.
- Optional steps can be skipped without placeholder records.
- Returning to a previous step does not lose persisted completed-step data.

## Acceptance criteria

- **ONB-AC-001:** A new account cannot enter normal authenticated routes before onboarding is complete unless explicitly allowed.
- **ONB-AC-002:** Required personal fields must be completed before finishing onboarding.
- **ONB-AC-003:** Optional work experience, education/certifications, Professional Focus, and skills can be skipped.
- **ONB-AC-004:** Data entered during onboarding appears unchanged in corresponding profile screens.
- **ONB-AC-005:** Completing onboarding sets an explicit completion timestamp and redirects to Profile.
- **ONB-AC-006:** A failed save provides retry feedback without losing current form input.
- **ONB-AC-007:** Every desktop onboarding step uses the shared two-panel public shell and displays the `Connect the parts of your professional story.` illustration in the right panel.
- **ONB-AC-008:** Skills selected during onboarding can be removed through the chip `×` control before the user finishes setup.
