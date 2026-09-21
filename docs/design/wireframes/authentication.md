# Wireframe: Authentication

## Login

```text
┌────────────────────────────────────┐
│ Career Profile                     │
│                                    │
│ Welcome back                       │
│                                    │
│ Email                              │
│ [____________________________]     │
│ Password                           │
│ [__________________________][eye]  │
│                                    │
│ [ Sign in ]                        │
│                                    │
│ New here? Create an account        │
└────────────────────────────────────┘
```

## Register

```text
┌────────────────────────────────────┐
│ Create your account                │
│                                    │
│ Email                              │
│ [____________________________]     │
│ Password                           │
│ [__________________________][eye]  │
│ Verify password                    │
│ [__________________________][eye]  │
│                                    │
│ Password requirements             │
│ ✓/• 10+ characters                │
│ ✓/• upper/lower/number/symbol      │
│                                    │
│ [ Create account ]                 │
└────────────────────────────────────┘
```

Field/server errors render below the relevant field or as a form-level message for invalid credentials.

## Admin-created / reset account: Set password

```text
Set your password
Email (read-only)
Password                    [eye]
Verify password             [eye]
[ Set password & continue ]
```

All password fields expose the shared eye control. Newly admin-created users continue to onboarding after password setup. A reset-password user keeps their existing onboarding completion state.

## Sign-in supporting visual

The desktop right panel shows a meaningful profile-building illustration: Experience, Education, and Certification records visibly connect into a Skills profile. Avoid count-only/profile-completeness marketing cards. The visual should demonstrate what the product does, not repeat generic marketing copy.
