# Flow: Authentication and Onboarding

```text
Register
  → validate account input
  → create USER + session
  → onboarding incomplete
  → Personal details
  → Career context
  → Work Experience (optional; Company → Job Title)
  → Education/Certification (optional; dependent catalogs)
  → Professional Focus (optional)
  → Skills (optional)
  → Complete onboarding
  → Profile

Login
  → valid session
  → onboarding complete? ─ yes → Profile
                         └ no  → Onboarding current step
```
