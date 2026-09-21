# Flow: Resume Import and Generation

## Import/profile generation

```text
Upload PDF/DOCX
  → validate
  → durable processing job
  → extract candidate profile records
  → user review
  → accept selected changes
  → persist profile + RESUME_IMPORT skill sources
```

## Generate resume

```text
Start generation
  → snapshot relevant saved profile data
  → durable generation job
  → milestone progress
  → completed artifact
  → download
```

Technology/provider choices remain intentional Q10 gates before implementation. They do not defer the feature from the initial release plan.
