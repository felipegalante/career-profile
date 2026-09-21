# Feature: Profile

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**
- Primary route: `/profile`

## Purpose

Provide one primary workspace for managing the user's professional profile. Work Experience, Skills, Education, Certifications, Professional Focus summary, and Resume Tools are managed from this page rather than through separate primary navigation destinations.

## Primary Profile page

The page contains:

- compact identity header with avatar/initials, display name, location, and profile-completion indicator;
- single compact `Resume tools` header CTA that opens a modal with `Import a resume` and `Generate an AI resume`;
- Work Experience section with add/edit actions;
- Skills section with Technical and Foundational proficiency lanes and edit behavior;
- Education section with add/edit actions;
- Certifications section with add/edit actions;
- Professional Focus summary with a manage action.

Do **not** show decorative count/stat cards for number of experiences, skills, education records, or certifications.

## Section management

Work Experience, Skills, Education, and Certifications do not have standalone primary product pages. Their add/edit/search/empty/expanded artifacts describe component/dialog states launched from `/profile`.

## Account menu

The user identity control at the bottom of the desktop navigation opens an account menu with:

- Profile
- Settings
- Sign Out

`Profile` and `Settings` open the same Account page using two tabs. Personal information is therefore accessed through the account menu rather than primary profile navigation.

## Resume tools

The Profile page owns one compact header CTA. The Profile body does not render a second Resume Tools card/section. Resume tools are not represented as a standalone navigation page.

## Empty/new profile

A user who has not started building their profile sees explicit placeholders for every major Profile section rather than a generic starter card. The initial placeholders are Work Experience, Skills, Education, Certifications, and Professional Focus. Each placeholder explains what belongs there and provides a single contextual action.

## Focused management surfaces

If a user drills from Profile into a focused Work Experience, Skills, Education/Certifications, or Professional Focus management surface, the surface shows a visible `Back to Profile` control and only one instance of its primary CTA.

## UI states

- loading profile;
- populated profile;
- new/mostly empty profile;
- section-level empty states;
- account menu open;
- resume tools modal open;
- load error with retry.

## Acceptance criteria

- **PRO-AC-001:** `/profile` is the primary professional-profile workspace.
- **PRO-AC-002:** Work Experience, Skills, Education, and Certifications are manageable from `/profile` without requiring separate navigation destinations.
- **PRO-AC-003:** The page does not display count-only profile stat cards.
- **PRO-AC-004:** Resume Tools appears exactly once as a compact header CTA and opens a modal with import and generation choices; no duplicate Resume Tools section is rendered in the Profile body.
- **PRO-AC-005:** Clicking the bottom user identity control exposes Profile, Settings, and Sign Out.
- **PRO-AC-006:** Profile and Settings are tabs of the same Account page.
- **PRO-AC-007:** Personal information is reachable from the Account/Profile tab.
- **PRO-AC-008:** Admin navigation is visible only to administrators.
- **PRO-AC-009:** Profile sections remain usable on narrow/mobile viewports.

- **PRO-AC-010:** A new/empty Profile renders placeholders for Work Experience, Skills, Education, Certifications, and Professional Focus.
- **PRO-AC-011:** Focused management surfaces expose `Back to Profile` and do not duplicate their primary CTA.

## Application-shell integration

Profile participates in the shared authenticated application shell. The global `Cmd/Ctrl+K` command palette exposes Profile navigation and relevant contextual actions such as Add Work Experience, Add Education, Add Certification, Edit Skills, and Resume Tools. `Cmd/Ctrl+B` toggles the sidebar without affecting Profile state. See [`application-shell.md`](application-shell.md).
