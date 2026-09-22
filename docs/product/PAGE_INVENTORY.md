# Page and State Inventory

This inventory distinguishes **routes/pages** from focused **component/dialog states**. Work Experience, Skills, Education, and Certifications are managed from the main Profile page.

| ID | Page/state | Kind | Delivery | Spec | Artifact |
| --- | --- | --- | --- | --- | --- |
| APP-01 | Application shell keyboard shortcuts | Component behavior | Initial | [Application Shell](features/application-shell.md) | `design-system/shell/keyboard-shortcuts.html` |
| APP-02 | Command palette | Overlay | Initial | [Application Shell](features/application-shell.md) | `design-system/components/command-palette.html` |
| AUTH-01 | Sign in | Route | Initial | [Authentication](features/authentication.md) | `auth/login.html` |
| AUTH-02 | Sign in error | State | Initial | [Authentication](features/authentication.md) | `auth/login-error.html` |
| AUTH-03 | Register | Route | Initial | [Authentication](features/authentication.md) | `auth/register.html` |
| AUTH-04 | Registration validation | State | Initial | [Authentication](features/authentication.md) | `auth/register-errors.html` |
| AUTH-05 | First/reset password setup | Route/state | Initial | [Authentication](features/authentication.md) | `auth/set-password.html` |
| AUTH-06 | Setup link invalid/expired/replayed | Route state | Initial | [Authentication](features/authentication.md) | `auth/set-password-link-invalid.html` |
| ONB-01 | Onboarding basics | Route/step | Initial | [Onboarding](features/onboarding.md) | `onboarding/basics.html` |
| ONB-02 | Onboarding career context | Route/step | Initial | [Onboarding](features/onboarding.md) | `onboarding/career.html` |
| ONB-03 | Onboarding focus | Route/step | Initial | [Onboarding](features/onboarding.md) | `onboarding/focus.html` |
| ONB-04 | Onboarding skills | Route/step | Initial | [Onboarding](features/onboarding.md) | `onboarding/skills.html` |
| PRO-01 | Profile workspace | Route | Initial | [Profile](features/profile-shell-overview.md) | `profile/profile.html` |
| PRO-02 | Profile empty/new state | State | Initial | [Profile](features/profile-shell-overview.md) | `profile/overview-empty.html` |
| PRO-03 | Profile mobile | State | Initial | [Profile](features/profile-shell-overview.md) | `profile/overview-mobile.html` |
| PRO-04 | Account menu | Overlay | Initial | [Profile](features/profile-shell-overview.md) | `profile/avatar-menu.html` |
| ACC-01 | Account · Profile tab | Route/tab | Initial | [Personal information](features/personal-information.md) | `profile/account.html` |
| ACC-02 | Account · Settings tab | Route/tab | Initial | [Personal information](features/personal-information.md) | `profile/account-settings.html` |
| ACC-03 | Edit profile information | Dialog | Initial | [Personal information](features/personal-information.md) | `profile/personal-edit.html` |
| EXP-01 | Work Experience section populated | Profile section | Initial | [Work Experience](features/work-experience.md) | `experience/experience.html` |
| EXP-02 | Work Experience empty | Profile section state | Initial | [Work Experience](features/work-experience.md) | `experience/experience-empty.html` |
| EXP-03 | Add/edit Work Experience | Dialog | Initial | [Work Experience](features/work-experience.md) | `experience/experience-add.html` |
| EXP-04 | Company search/custom | Combobox states | Initial | [Selectors](features/catalog-backed-selectors.md) | `experience/company-search.html` |
| EXP-05 | Job Title dependent search | Combobox state | Initial | [Work Experience](features/work-experience.md) | `experience/job-title-search.html` |
| EDU-01 | Education section/empty | Profile section state | Initial | [Education](features/education.md) | `education/education-empty.html` |
| EDU-02 | Add/edit Education | Dialog | Initial | [Education](features/education.md) | `education/education-add.html` |
| EDU-03 | Institution → Major / Specialization → Degree Type selectors | Combobox states | Initial | [Education](features/education.md) | `education/institution-search.html` |
| CERT-01 | Certifications section/empty | Profile section state | Initial | [Certifications](features/certifications.md) | `certifications/certifications-empty.html` |
| CERT-02 | Add/edit Certification | Dialog | Initial | [Certifications](features/certifications.md) | `certifications/certification-add.html` |
| CERT-03 | Board → Certification / Exam selectors | Combobox states | Initial | [Certifications](features/certifications.md) | `certifications/board-search.html` |
| FOC-01 | Professional Focus | Route | Initial | [Professional Focus](features/professional-focus.md) | `focus/focus.html` |
| FOC-02 | Edit/search/custom Focus | Dialog/state | Initial | [Professional Focus](features/professional-focus.md) | `focus/focus-edit.html` |
| SKL-01 | Skills embedded view | Profile section | Initial | [Skills](features/skills.md) | `skills/skills.html` |
| SKL-02 | Skills expanded | Profile section state | Initial | [Skills](features/skills.md) | `skills/skills-expanded.html` |
| SKL-03 | Skills edit + drag/drop | Profile section state | Initial | [Skills](features/skills.md) | `skills/skills-edit.html` |
| SKL-04 | Skill search/custom | Combobox state | Initial | [Skills](features/skills.md) | `skills/skills-search.html` |
| SKL-05 | Skill feedback | Toast/state | Initial | [Skills](features/skills.md) | `skills/skills-feedback.html` |
| SKL-06 | Inferred skill source details | Chip tooltip/popover state | Initial | [Skills](features/skills.md) | `skills/skills-edit.html` (update required) |
| ADM-01 | Admin users | Route | Initial | [Admin Users](features/admin-users.md) | `admin/users.html` |
| ADM-02 | Create user | Dialog | Initial | [Admin Users](features/admin-users.md) | `admin/users-create.html` |
| ADM-03 | Reset password | Dialog | Initial | [Admin Users](features/admin-users.md) | `admin/users-reset-password.html` |
| RES-00 | Resume Tools chooser | Modal | Initial | [Resume](features/resume.md) | `profile/resume-tools.html` |
| RES-01 | Resume import | Modal | Initial | [Resume](features/resume.md) | `resume/upload.html` |
| RES-02 | Resume processing/generation | Modal | Initial | [Resume](features/resume.md) | `resume/processing.html` |
| RES-03 | Resume generated | Modal | Initial | [Resume](features/resume.md) | `resume/complete.html` |
| RES-04 | Generated resume preview | Secondary surface | Initial | [Resume](features/resume.md) | `resume/generated.html` |
