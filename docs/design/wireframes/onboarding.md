# Wireframe: Onboarding

Onboarding reuses normal profile components rather than maintaining separate one-off forms.

## Shell

Desktop onboarding uses the same split layout as authentication. The step-specific form occupies the left panel and the shared product-value illustration occupies the right panel throughout the flow.

```text
┌────────────────────────────────┬──────────────────────────────────────┐
│ Career Profile                 │ BUILD A PROFILE THAT STAYS USEFUL    │
│                                │                                      │
│ Step N of 7                    │ Connect the parts of your            │
│ ●────●────●────○────○────○────○ │ professional story.                  │
│                                │                                      │
│ [step-specific form]           │ Experience / Education /             │
│                                │ Certification  →  Skills profile     │
│ [Skip]              [Continue] │                                      │
└────────────────────────────────┴──────────────────────────────────────┘
```

The right panel is intentionally stable across onboarding steps. On smaller screens it follows the responsive public-shell behavior.

## Step content example

```text
Step 3 of 7                                      Save & exit
●────●────●────○────○────○────○

Work experience (optional)
Add a role now or skip and complete it later.

Company *
[ Search companies... ]

-- Job Title appears after Company selection --

[ Skip for now ]                         [ Save & continue ]
```

## Steps

1. Personal details
2. Career context
3. Work Experience (optional): Company → Job Title
4. Education / Certification (optional): dependent catalog fields
5. Professional Focus (optional): searchable focus areas, optional primary
6. Skills (optional): catalog/custom search, default Intermediate
7. Review / Finish profile

Optional steps expose `Skip for now`. Data saved here appears in the normal profile module immediately.


## Selected skills interaction

The Skills onboarding step uses the same removable chip interaction as the main Skills editor:

```text
[ React  × ] [ Problem Solving  × ]
         ↑
   remove selection
```

The `×` is a focusable control and updates the onboarding selection immediately.
