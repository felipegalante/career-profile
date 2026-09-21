# Resume Tools Wireframes

Resume Tools is launched from a compact CTA on the main Profile page. It is not a standalone navigation page.

## Choice modal

```text
Resume tools
Choose how to use your resume with Career Profile.

[ Import a resume ]
Upload PDF/DOCX and review proposed profile updates.

[ Generate an AI resume ]
Build a draft from saved profile data.
```

Import, processing/generation, completion, retry, and error experiences remain modal states over Profile.


## Generated resume preview

```text
← Back to Profile

Resume preview                         [Regenerate] [Download PDF]
Generated from the current profile. Review before downloading.

                     ┌──────────────────────────────────────────┐
                     │ MAYA CHEN                    contact...  │
                     │ Senior Product Engineer                  │
                     │──────────────────────────────────────────│
                     │ PROFESSIONAL SUMMARY                     │
                     │ concise generated summary               │
                     │                                          │
                     │ EXPERIENCE                               │
                     │ Senior Product Engineer · Shopify        │
                     │ Mar 2024 – Present                       │
                     │ • achievement / responsibility           │
                     │ • achievement / responsibility           │
                     │                                          │
                     │ SKILLS                                   │
                     │ Technical     TypeScript, PostgreSQL...  │
                     │ Foundational  Communication, Planning... │
                     │                                          │
                     │ EDUCATION                                │
                     │ MSc · Computer Science · UBC             │
                     │                                          │
                     │ CERTIFICATIONS                           │
                     │ AWS Certified Solutions Architect        │
                     └──────────────────────────────────────────┘
```

The paper itself is intentionally single-column and ATS-friendly. Application navigation and actions live outside the generated document.
