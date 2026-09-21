# Feature: Resume Import and Generation

- Product status: **Accepted**
- Delivery: **Initial release**
- Implementation status: **Not Started**

This feature is part of the initial implementation plan. Its storage, job, provider, retention, review/merge, and factual-content decisions remain explicit Q10 gates before implementation starts.

## Resume entry surface

`/profile` exposes a compact Resume Tools CTA. Activating it opens a modal with two primary actions:

- `Upload resume` to propose profile data from an existing document;
- `Generate resume` to create a new document from saved profile data.

Resume tooling is not a standalone navigation page. Import/generation/status experiences are dialogs or modal states launched from Profile. The CTA may show the most recent generated/uploaded resume status when one exists.

## Capability A: Upload resume to populate profile

### User flow

1. User opens `Upload resume`.
2. Dialog accepts drag/drop or file picker.
3. Supported formats: PDF and DOCX.
4. File is uploaded and processed asynchronously.
5. Processing extracts candidate profile data such as work experience, education, certifications, and skills.
6. User reviews proposed changes before authoritative profile data is changed.

### Product requirements

- validate extension/MIME/size;
- never silently overwrite existing profile records;
- imported skills use `RESUME_IMPORT` provenance if accepted;
- parsing errors are recoverable and explain what failed;
- raw uploaded documents have an explicit retention/deletion policy before implementation.

## Capability B: Generate resume from profile

### User flow

1. User starts generation from current profile.
2. Progress dialog communicates major stages rather than a fake percentage.
3. On completion, user receives a success dialog with options to preview or download the generated document.
4. Preview opens a focused secondary surface with a visible `Back to Profile` action.
5. Generated output should be editable in a future richer implementation, but editable-resume tooling is not required by this specification yet.

#
## Generated resume layout

The first generated layout is a clean, single-column, ATS-friendly document rather than an application-style card layout. The preview includes:

- name and target/current professional title;
- contact information;
- professional summary;
- work experience in reverse chronological order;
- Technical and Foundational skills;
- education;
- certifications.

Layout requirements:

- designed for PDF/print output and readable at standard Letter/A4 widths;
- no profile avatar, decorative sidebar, progress indicators, or application chrome inside the document itself;
- restrained typography and one subtle accent color are acceptable, but content hierarchy must survive grayscale printing;
- generated statements must be grounded in saved profile data; generation must not fabricate employers, dates, credentials, or skills;
- the preview may use application chrome around the paper, but the resume document is visually self-contained;
- download filename should be predictable, e.g. `Maya-Chen-Resume.pdf`.

## Example progress milestones

- Profile summary prepared
- Work experiences included
- Education/certifications included
- Draft document generated

## Implementation gates

Before implementation, define separate ADRs only if needed for:

- file/object storage provider;
- asynchronous job execution;
- document parsing provider/libraries;
- generative model/provider;
- generated document format/storage;
- retention/security policy.

Do not preselect these technologies in product docs.

## Acceptance criteria

- **RES-AC-001:** User can choose/drop a supported resume file and invalid files are rejected before processing.
- **RES-AC-002:** Processing exposes a durable status and recoverable error state.
- **RES-AC-003:** Extracted profile information is reviewable before merge.
- **RES-AC-004:** Accepted imported skills use resume provenance rather than becoming indistinguishable manual skills.
- **RES-AC-005:** User can start resume generation from saved profile data.
- **RES-AC-006:** Generation shows meaningful progress states and a clear failure/retry state.
- **RES-AC-007:** Completed generated resume can be downloaded.
- **RES-AC-008:** Completed generated resume can be previewed before download.
- **RES-AC-009:** Preview uses the documented single-column resume hierarchy for summary, experience, skills, education, and certifications.
- **RES-AC-010:** Generated resume content must not invent factual profile data that is absent from the saved profile.
