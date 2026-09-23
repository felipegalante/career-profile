# Navigation

## Unauthenticated

```text
/login
/register
/set-password     conditional first-password/reset flow
```

## Authenticated

Primary navigation:

```text
/profile          Profile workspace
/profile/focus    Professional Focus
```

Work Experience, Skills, Education, and Certifications are sections managed within `/profile`; their dialogs and interaction states are not separate primary navigation destinations.

## Account menu

Clicking the user/avatar control at the bottom of desktop navigation opens:

```text
Profile   -> /account?tab=profile
Settings  -> /account?tab=settings
Sign Out
```

Profile and Settings render as two tabs of the same Account page. Personal information is on the Profile tab.

## Admin

```text
/admin/users
```

Only ADMIN users see/access admin navigation, grouped under an "Administration" heading in the rail. Incomplete onboarding users are routed through onboarding after required password setup.

## Narrow screens

At 860px and below, the rail is replaced by a top bar with the brand and a menu button. The button opens a focus-trapping navigation drawer with the same destinations as the rail (Profile, Professional Focus, and Administration when permitted) followed by the account actions (Profile, Settings, Sign out). Escape or the close button dismisses it and returns focus to the menu button. The bottom destination bar drawn in `design-system/shell/mobile.html` and `skills/skills-mobile.html` is not used.

## Focused management navigation

Work Experience, Skills, Education/Certifications, and Professional Focus may use focused secondary management surfaces reached from `/profile`. These are not primary navigation destinations. When shown, they expose a visible `Back to Profile` action at the top.

## Keyboard navigation accelerators

On authenticated desktop layouts:

```text
Cmd/Ctrl + B  -> toggle sidebar
Cmd/Ctrl + K  -> open command palette
```

The command palette provides permission-aware navigation to Profile, Professional Focus, Account tabs, and Admin Users for administrators, plus context-sensitive Profile actions. Collapsing the sidebar keeps the current route and page state unchanged.
