# Career Profile architecture readiness review

Review date: 2026-09-20. Scope: the complete supplied starter, specifications, configuration, seeds, and rendered design artifacts. This is a planning review; no product implementation is included.

## Executive summary

**Conditional-go for a reviewed foundation phase; no-go for implementing password establishment as currently described.** The accepted modular monolith, Fastify/Yoga boundary, Drizzle/PostgreSQL persistence, domain catalogs, and profile-centered navigation are appropriate. The problem is incomplete contracts and conflicting sources, rather than a need to replace the stack.

There are **30 material findings: 1 P0, 19 P1, 8 P2, and 2 P3**. P0 describes a security defect in the proposed flow, not an exploitable implemented endpoint. P1 findings must close before their affected phase; they do not all block foundation work. The replacement plan is [implementation/README.md](../implementation/README.md). Phase 0 has **not** started.

## Second-pass principal-engineer corrections

The modular monolith and typed relational provenance remain appropriate. The first plan nevertheless front-loaded speculative work and overstated some coverage boundaries. These corrections supersede its earlier recommendations; they do not change product status or resolve open product choices.

| Review concern | Correction and reason |
| --- | --- |
| Catalog infrastructure without a user outcome | Phase 03 now saves a real catalog skill and MANUAL source, then reloads it. Company/private relation work moves to the actual Work form in 05; no synthetic owning-transaction harness. |
| Onboarding postponed until every domain was complete | Required fields/completion arrive in 02C, optional forms integrate in their own domains, and 09 verifies the final journey. This exposes form/service reuse problems early. Seven steps already belong to the feature spec. |
| Milestones too large for safe review | [REVIEW_SLICES](../implementation/REVIEW_SLICES.md) breaks milestones into separately reviewable user actions, including custom creation, Move versus drag, record CRUD versus derivation, and Admin browse/create/reset. Each owns tests and failure states. |
| Premature shared frameworks | No generic catalog resolver/repository, form engine, feature registry, table framework or source strategy system. Required combobox/dialog start minimal; shared server behavior is extracted against a second real consumer. Remove artificial Work → Education/Certification dependency. |
| Unjustified frontend packages and foundation scope | No new UI/client library in 00. Client codegen begins with auth operations; cache, validation, icon and headless libraries are conditional on actual consumers/evidence. Required routing, password hashing and drag remain justified at their consuming slice. |
| Over-broad mutation machinery | Ordinary CRUD uses documented atomic last-committed-write behavior. Revision checks remain for whole-list Focus and optimistic Skills. Refetch skills after domain saves instead of returning the whole graph everywhere. Focus uses transactional replacement, not deferred order-uniqueness machinery. |
| Future derived skills | Preserve typed record FKs and additive source migrations. One per-user lock handles absent-association races; source edits affect only their own links, preserve proficiency and remain idempotent. Test same-type sources, updates, failures and last-source behavior. No event bus, source registry or bulk remap job. |
| Coverage that was only a family label | [COVERAGE](../implementation/COVERAGE.md) now gives 123 criterion-specific planned scenarios. Catalog completion spans nine consumers; contextual commands/mobile/focused surfaces finish against real domains. PRO-AC-002 closes with four named domains, not Focus. No actual feature-test coverage exists yet. |
| Artificial approval blockers | Q01 blocks unsafe setup/reset, not runtime or register/login; Q11 blocks first styled UI, not build tooling. No new Focus editor-mode decision is needed for the documented searchable dialog. Durable onboarding progress and future account purge remain out unless required. |

Q02 is resolved: `×` dismisses derived-supported skills from the Skills profile without deleting source facts; a separate dismissal record prevents source edits from restoring them, and manual re-add clears it. Reviewed mappings attach automatically on source save. Inferred chips have a distinct named color treatment and accessible source-details control. Other existing questions retain their narrowed affected-slice gates.

## Status vocabulary and authority

- **CONFIRMED**: supported by existing requirements or direct inspection; does not mean implemented.
- **PLANNED**: a proposed engineering resolution or delivery task; not silently accepted product behavior.
- **DEFERRED**: explicitly outside the initial release.
- **OPEN QUESTION**: conflicting or missing decision requiring its owner to resolve it.
- **SUPERSEDED**: retained historical planning material replaced by the linked current plan.

Existing product `Accepted` maps to CONFIRMED requirement intent; `Not Started` remains unchanged. Feature specs own product behavior, design docs own interaction/presentation, and ADRs own lasting technical choices. Findings below are CONFIRMED observations; recommendations are PLANNED unless labeled OPEN QUESTION. Conflicting documents remain unchanged until the owner records a decision.

## Inspection and verification

Read root and all three nested AGENTS files, README, every product/architecture/ADR/engineering/design Markdown file, all six local skill files and six agent configurations, manifests, TypeScript/Vite/test configuration, application sources, both tooling scripts, baseline SQL, and every seed dataset. Inspected HTML text/structure across the complete artifact set, shared CSS and scripts, the manifest, index, and all-pages gallery. Visually inspected representatives of every product domain, design components and flows; details and limitations are in [artifact-audit.md](artifact-audit.md).

There are 83 manifest entries and 83 gallery iframes; three additional content HTML files are outside the manifest. The only executable database migration is `SELECT 1`. There is no schema, seed loader, GraphQL API, product UI, lockfile, or installed workspace dependencies. The current Git branch has no commits and all supplied starter content is untracked. No files were staged or committed.

Static seed checks covered all rows: JSON parsing, CSV shape, seed-key duplicates, normalized-label duplicates using NFKC + casefold + whitespace collapse, relationship foreign references, and repeated relationship tuples. All catalog references passed; one profile skill label did not. This is not database migration/seed execution. The normalization check is diagnostic, not an adopted product normalization policy.

`node scripts/verify.mjs` failed before database access with `ERR_MODULE_NOT_FOUND: pg`. Node in the audit shell is 22.22.3, below the repository's declared 24 minimum. No dependencies were installed and no migrations ran. Typecheck and product tests were not runnable in this checkout. All 24 distinct declared package/version baselines, including pnpm, exist in the npm registry; existence does not establish a compatible installed graph. See [dependency-choices.md](dependency-choices.md).

## Current strengths

- CONFIRMED: separate product, design, and architecture ownership; strict TypeScript; pnpm workspaces; focused GraphQL mutations; no product REST scaffolding to unwind.
- CONFIRMED: ADRs 0001–0010 are technical decisions worth retaining. ADRs 0001/0004 overlap but address deployment and module boundaries respectively; no historical ADR needs deletion or conversion into a product spec.
- CONFIRMED: server-orchestrated custom values and domain-specific catalog tables avoid orphan writes and an EAV model. Scope/owner checks and partial uniqueness are recognized, though not yet specified completely.
- CONFIRMED: multi-source provenance is separate from skill definition origin, manual skills default to Intermediate, and required same-category drag/drop has a required Move alternative.
- CONFIRMED: desktop auth/onboarding share the professional-story illustration; the empty Profile has five useful placeholders; semantic toasts have full green/red surfaces; Focus uses icons without decorative stripes; Admin has one page-level Create user CTA.
- CONFIRMED: no unwanted product-origin framing was found. No Express implementation, competing lockfile, top-five Focus rule, or optional-drag requirement was found. `credentials` in authentication/security text and `isCustom` in an explanatory rejection are not stale product terminology.

## P0 findings

### R01 — Password establishment lacks proof of account control

**Severity:** P0. **Category:** Security. **Affected phase:** 01, 10.

**Evidence:** [Authentication, Admin-created accounts](../../product/features/authentication.md), [Security, Admin-created/reset accounts](../../architecture/SECURITY.md), [Admin reset](../../product/features/admin-users.md), and [set-password artifact](../../design/artifacts/auth/set-password.html). An account with no usable password can receive `PASSWORD_SETUP_REQUIRED`, but no authorization grant for `setPassword` is defined; identity proof is described as future deployment work.

**Why it matters:** email knowledge cannot authorize choosing an account's password. The same gap affects reset accounts and newly created admins. Publicly exposing setup status also conflicts with generic account-existence responses.

**Resolution:** OPEN QUESTION Q01. Recommend an admin-issued, high-entropy, short-lived, one-use setup link conveyed through an agreed trusted channel, with only its hash stored. This is a new activation capability and needs explicit product approval because verification-code/email flows are excluded. No email delivery, MFA, or SSO is implied. Return setup outcomes only after valid proof; otherwise preserve generic login responses. Consume grant, set password, rotate session, and invalidate prior grants atomically. If this mechanism is rejected, those account flows must remain unavailable until another proof mechanism is approved; do not implement email-only setup.

## P1 findings

### R02 — Catalog and relationship ownership is not a complete integrity contract

**Severity:** P1. **Category:** Database. **Affected phase:** 03, 05–08.

**Evidence:** [Data Model](../../architecture/DATA_MODEL.md), especially “company_job_titles”, “institution_programs”, and “certifications”, names scope conventions but leaves relation ownership optional and does not enforce certification board/definition agreement or prohibit cross-owner references.

**Why it matters:** a visible parent can reveal another viewer's private association; global rows can accidentally reference private children. Two independent certification FKs permit mismatched boards. Retrofits require data repair.

**Resolution:** define explicit global/private association invariants, partial unique keys, deletion rules, ownership-checked writes and database enforcement for cross-table references. See [data-contracts.md](data-contracts.md). Database CHECK constraints alone cannot enforce other-row ownership; use composite keys where suitable and narrowly scoped triggers otherwise. Keep search and direct lookup authorization identical.

### R03 — Polymorphic provenance has no referential or concurrency guarantees

**Severity:** P1. **Category:** Database. **Affected phase:** 04–07.

**Evidence:** [Data Model, user_skill_sources](../../architecture/DATA_MODEL.md) contains nullable source entity ID with no typed FK, source-shape check, source uniqueness or ownership rule; [ADR 0005](../../architecture/adr/0005-multi-source-skill-provenance.md) requires multiple sources.

**Why it matters:** dangling/cross-user provenance, duplicate MANUAL sources, and simultaneous detach/attach operations can remove supported skills.

**Resolution:** introduce provenance with manual skills, before source domains. Use typed nullable source FKs with exactly-one/source-type checks as each domain arrives, unique manual and per-source links, same-owner enforcement, and transactional reconciliation locking the affected skill rows. Do not postpone correctness to a final provenance phase.

### R04 — Remove-skill semantics and derivation lifecycle required a product decision

**Severity:** P1. **Category:** Product. **Affected phase:** 04–07.

**Evidence:** [Skills, Removal behavior](../../product/features/skills.md) says the chip removes the skill, but permits keeping it after removing only MANUAL provenance; [derived-skills flow](../../design/flows/derived-skills.md) describes automatic source attachment without acceptance criteria for deriving, updating, rejecting or reattaching candidates.

**Why it matters:** an `×` can appear ineffective, optimistic “removed” feedback can lie, and edits can re-add a deliberately removed skill. Last-source deletion is not explicitly settled.

**Resolution:** DECIDED. `×` removes a manual-only skill association, but dismisses an inferred or otherwise derived-supported skill from the Skills profile while preserving its source facts and links. A dismissal persists across source edits; re-adding manually clears it; final-source deletion removes the association and dismissal. Reviewed deterministic mappings attach automatically with each source save, with no candidate-review workflow. Inferred chips receive a distinct named color treatment and an accessible hover/focus/touch source-details control. Do not invent a recommendation system.

### R05 — Custom-skill classification has no deterministic rule

**Severity:** P1. **Category:** Product. **Affected phase:** 04.

**Evidence:** [Skills, Custom skill creation](../../product/features/skills.md) accepts only a label and promises classification/fallback; [custom skill artifact](../../design/artifacts/skills/skills-custom.html) says the system classifies it. No classifier, fallback category, confidence policy, correction path or test fixtures exist.

**Why it matters:** category is definition-owned and cannot be corrected by dragging. Arbitrary defaults create persistent wrong categories.

**Resolution:** OPEN QUESTION Q03. Product must approve a deterministic rule/fallback or amend the label-only interaction. Recommend a small reviewed rule set with an explicit approved fallback, without adding an AI dependency; do not claim the rule is already confirmed.

### R06 — Onboarding artifacts conflict with seven steps and required fields

**Severity:** P1. **Category:** Product. **Affected phase:** 02, 09.

**Evidence:** [Onboarding spec](../../product/features/onboarding.md) and [wireframe](../../design/wireframes/onboarding.md) define seven steps; [basics](../../design/artifacts/onboarding/basics.html) through [skills](../../design/artifacts/onboarding/skills.html) show four. Basics offers Skip and lacks a separate required country; onboarding Focus is a fixed chip selection without catalog search. Existing [plan](../IMPLEMENTATION_PLAN.md) finishes onboarding before Experience/Education/Skills.

**Why it matters:** ONB-AC-002/003/004 cannot be met by copying the artifacts or old sequencing. Resume-after-exit semantics are not modeled.

**Resolution:** OPEN QUESTION Q04. Recommend seven-step feature/wireframe authority, add missing work/education-certification/review artifacts and supported-country/language rules; persist current step separately from domain records or explicitly define resume reconstruction. Deliver required-fields onboarding/completion in 02C, integrate optional forms with each domain in 03–08, and use 09 for final journey validation. Seven steps are authoritative in the feature spec; do not require product to reapprove them solely because an artifact is stale.

### R07 — Initial Profile requires an active Resume chooser

**Severity:** P1. **Category:** Product. **Affected phase:** 02, R1, R2.

**Evidence:** PRO-AC-004 requires an active Resume Tools chooser; [Resume spec](../../product/features/resume.md) now places import and generation in initial scope; [page inventory](../../product/PAGE_INVENTORY.md) marks RES-00 initial; [shell spec](../../product/features/application-shell.md) includes the command.

**Why it matters:** implementers may ship a dead control or treat an active initial-release capability as optional.

**Resolution:** DECIDED. Resume Tools is an initial-release capability. Deliver its one Profile CTA and palette command with the R1/R2 flows; neither appears as a placeholder before its corresponding action works. Q10 remains the product/security gate for the implementation details.

### R08 — Account and Profile visuals require unspecified behavior/data

**Severity:** P1. **Category:** Product. **Affected phase:** 02, R2.

**Evidence:** [Account settings](../../design/artifacts/profile/account-settings.html) exposes Change password and last-changed date without an operation/AC; [personal-edit](../../design/artifacts/profile/personal-edit.html) omits country, preferred language, postal code, LinkedIn and career context required by [Personal Information](../../product/features/personal-information.md). [Profile](../../design/artifacts/profile/profile.html) shows a title and “82% complete” without a formula/source.

**Why it matters:** copied forms cannot edit the specified profile; display-only invented metrics become accidental product rules.

**Resolution:** OPEN QUESTION Q06. Complete the personal-data form; define supported countries/languages and career enums. Recommend deferring completeness percentage and explicit title/summary fields unless approved. Decide whether Settings includes authenticated password change (current-password reauthentication, rotation and AC) or only approved account actions. Do not treat admin reset as self-service password change.

### R09 — Date precision, optionality and status combinations are undefined

**Severity:** P1. **Category:** Database. **Affected phase:** 05–07.

**Evidence:** [Work wireframe](../../design/wireframes/work-experience.md) and [Certification wireframe](../../design/wireframes/certifications.md) use month/year; [Data Model](../../architecture/DATA_MODEL.md) says date; fixtures use first-of-month dates. [Education](../../product/features/education.md) has status plus current flag without a compatibility table. Start/end requiredness is unclear.

**Why it matters:** day values could be fabricated, timezone conversions could move months, and contradictory status/current values can be saved.

**Resolution:** OPEN QUESTION Q07. Recommend explicit `YearMonth` transport/storage for work/certification month precision, integer years for education, `LocalDate` for DOB, and UTC timestamps for events. Define allowed nulls and status/current pairs before domain migrations.

### R10 — Search and parent-validity rules cannot yet produce one test oracle

**Severity:** P1. **Category:** Architecture. **Affected phase:** 03, 05–08.

**Evidence:** CAT-AC-001 specifies lexical tiers; EXP-AC-004 says company titles first; [Catalog Search](../../architecture/CATALOG_SEARCH.md) permits relationship relevance before weaker lexical matches. CERT-AC-004 and its prose say “scopes/prioritizes” and “only/primarily”. Normalization and compatibility of a child after parent change have no complete algorithm.

**Why it matters:** global exact vs related fuzzy ordering is ambiguous; an exam from the wrong board could be saved; changing punctuation normalization later changes uniqueness.

**Resolution:** OPEN QUESTION Q08. Recommend lexical tier first, related-before-global within tier, stable label/ID tie-breaks; strict board scoping; global fallback for company titles/programs with viewer-private inferred relations. Approve normalization preserving meaningful punctuation (C/C++/C#) and a parent-validity matrix. Freeze golden ranking tests before implementing every selector.

### R11 — Focus replacement and primary/order constraints need concurrency rules

**Severity:** P1. **Category:** Database. **Affected phase:** 08.

**Evidence:** [Professional Focus](../../product/features/professional-focus.md) specifies ordered selection and optional primary; [GraphQL](../../architecture/GRAPHQL.md) uses whole-list `updateProfessionalFocus`; [Data Model](../../architecture/DATA_MODEL.md) only states at most one primary.

**Why it matters:** concurrent saves can lose selections; swapping two sort positions can transiently violate uniqueness; simultaneous primary changes can conflict.

**Resolution:** add a per-user focus revision, lock/check it in the transaction, unique user/definition, partial unique primary, and transactional delete-and-insert list replacement, with validated contiguous positions. Return `CONFLICT` plus canonical list instead of overwriting an unseen newer list. Removing primary leaves none.

### R12 — Cookie and GraphQL threat controls are not specified

**Severity:** P1. **Category:** Security. **Affected phase:** 00, 01, 10, 11.

**Evidence:** [Security](../../architecture/SECURITY.md) and [ADR 0003](../../architecture/adr/0003-server-managed-session-cookies.md) mention deliberate CSRF settings but omit an Origin/CSRF contract, login throttling, cookie path, session reset race, request/query limits and log redaction. `api/src/app.ts` disables logging.

**Why it matters:** HttpOnly/SameSite alone are not a complete browser mutation policy; aliases/batching can bypass naive login limits, and concurrent reset/login can recreate valid sessions.

**Resolution:** use same-origin deployment/dev proxy, explicit trusted Origin plus non-simple request/CSRF protection, no GET mutations, bounded request size/depth/aliases/search limits, service-level auth throttles, opaque hashed session tokens and credential generation checks. Reset locks identity state, invalidates sessions and grants, preserves onboarding, and records a minimal audit event. Set redaction before enabling request logs. See [api-frontend-contracts.md](api-frontend-contracts.md).

### R13 — Seeds cannot currently validate account/provenance/custom workflows

**Severity:** P1. **Category:** Seeds. **Affected phase:** 01, 03–10.

**Evidence:** [profile fixtures](../../../db/seeds/profile-fixtures.seed.json) reference `Communication`, absent from [skills CSV](../../../db/seeds/global-skills.csv); all four [users](../../../db/seeds/users.seed.json) have plaintext development passwords and none represents setup-required; every fixture skill has one MANUAL source; custom examples are unattached labels. There is no executable loader.

**Why it matters:** a strict loader will fail or silently create the wrong skill; privacy, multi-source deletion, onboarding/reset routing and concurrent duplicate cases have no realistic baseline.

**Resolution:** repair references using stable seed keys, define explicit private ownership and source fixtures, add setup/reset/empty users and two owners with the same custom label. Development passwords must be hashed before persistence and never logged; seed accounts must be refused outside an explicit disposable development/test target. Separate small deterministic test fixtures from larger demo data. See [seed-audit.md](seed-audit.md).

### R14 — Interactive artifacts do not fulfill their accessibility contracts

**Severity:** P1. **Category:** Accessibility. **Affected phase:** 00, 02–04, 11.

**Evidence:** [keyboard-shortcuts.js](../../design/artifacts/assets/keyboard-shortcuts.js) toggles overlays but implements no Arrow/Enter filtering or focus trap; palette rows are generic elements. [Skills edit](../../design/artifacts/skills/skills-edit.html) implements pointer drag and removal but no per-chip Move menu. Many form specimens use `div.input` and decorative eye spans.

**Why it matters:** the artifacts are useful visual references, but copying their markup would fail APP-AC-003, CAT-AC-003 and SKL-AC-010. The model must not mistake interactive demonstrations for production components.

**Resolution:** implement semantic accessible primitives, modal focus lifecycle, real input labels, per-chip Move buttons, and live feedback; test pointer and keyboard separately. Removal must restore focus to a surviving chip/action. All nine catalog domains must share the tested mechanics.

### R15 — Responsive shell/table artifacts conflict and overflow

**Severity:** P1. **Category:** UX. **Affected phase:** 02, 10, 11.

**Evidence:** [mobile shell](../../design/artifacts/design-system/shell/mobile.html) and [mobile Skills](../../design/artifacts/skills/skills-mobile.html) promote Overview/Experience/Skills destinations against [Navigation](../../design/NAVIGATION.md). At 390px the actual Profile hides `.side` without a replacement menu; Admin document scroll width measured 575px and the table parent has `overflow-x: visible`.

**Why it matters:** mobile users lose Account/Focus access and table controls extend beyond the viewport. A standalone mobile mockup does not prove the desktop artifact responds correctly.

**Resolution:** OPEN QUESTION Q09 for navigation presentation. Recommend the spec's drawer with the same primary destinations and Account actions; use a named, keyboard-scrollable table region or reviewed card rows. Test 320/390/768/1280 widths, zoom/reflow, virtual keyboard and sticky dialog footer.

### R16 — Root tooling imports a package it does not own and uses old migrations

**Severity:** P1. **Category:** Tooling. **Affected phase:** 00.

**Evidence:** [verify](../../../scripts/verify.mjs) and [migrate](../../../scripts/migrate.mjs) import `pg`, declared only in [api/package.json](../../../api/package.json); root has only concurrently. `db:migrate` uses the custom runner and `schema_migrations`, while ADR 0009 selects Drizzle Kit. No Drizzle config/schema/journal exists.

**Why it matters:** an isolated pnpm install does not promise root access to an API-only dependency; two migration histories are a future drift hazard. Current verification already fails at import, although dependencies are also absent.

**Resolution:** move DB command entry points into the API workspace and have root forward them. Adopt one Drizzle migration history before domain changes; reconcile any previously applied no-op bootstrap explicitly rather than deleting a live history. Keep the `pg` driver.

### R17 — Reproducibility and runtime support are not established

**Severity:** P1. **Category:** Tooling. **Affected phase:** 00.

**Evidence:** no pnpm lockfile/build commands/CI; root permits Node >=24, but declared jsdom 30.0.0 requires Node ^24.15.0 on the 24 line. API Node typings target 26. `.env.example` is not loaded by current scripts, API has localhost defaults, and shutdown does not close the shared pool.

**Why it matters:** a documented supported Node installation can fail, newer type APIs can compile against an older runtime, and local defaults mask misconfiguration. Dependency existence is not an installed compatibility test.

**Resolution:** pin a tested Node 24 patch >=24.15.0, align typings, generate/review one pnpm lockfile in Phase 0, validate configuration explicitly, document local env loading, add build/smoke commands and CI. Fail closed on missing production DB/cookie settings; close pool/server on shutdown. Do not blindly downgrade current package versions or change stack.

### R18 — Verification can report misleading health and is not isolated

**Severity:** P1. **Category:** Testing. **Affected phase:** 00, 11.

**Evidence:** [health route](../../../api/src/routes/health.routes.ts) returns HTTP 200 and raw database errors; [health test](../../../api/src/health.spec.ts) hits the configured database yet asserts only `api: ok`; [verify](../../../scripts/verify.mjs) mutates configured DB, logs its credential-bearing URL on failure, can probe another process on port 3001, and calls `process.exit` inside a cleanup-sensitive path. Home test checks a heading only.

**Why it matters:** green checks need not prove this API connected successfully, failures can expose secrets or leave processes, and tests depend on local services without declaring it.

**Resolution:** separate liveness/readiness with sanitized readiness failure; inject test DB dependency; use a dedicated disposable integration DB, unique child port/instance proof, finally-based cleanup and redacted errors. Include typecheck, build, GraphQL smoke and migration/seed rerun in the verification contract.

### R19 — Resume preview contains facts the profile cannot supply

**Severity:** P1. **Category:** Product. **Affected phase:** R2.

**Evidence:** [generated preview](../../design/artifacts/resume/generated.html) contains achievement bullets and a Solutions Architect certificate; [Profile](../../design/artifacts/profile/profile.html) shows Cloud Practitioner and has no achievement fields. [Work spec](../../product/features/work-experience.md) stores role/dates/type, not achievements; RES-AC-010 prohibits fabrication.

**Why it matters:** treating the preview as a content requirement would encourage invented accomplishments. The record mismatch breaks the grounding example.

**Resolution:** OPEN QUESTION Q10 before Resume. Either approve authored summary/achievement fields with AC, or generate only supportable neutral summaries/listings and omit unsupported claims. Make preview and source fixtures identical. Preserve single-column layout and defer provider/storage decisions.

### R20 — Required domain states/controls lack complete artifact coverage

**Severity:** P1. **Category:** UX. **Affected phase:** 02, 05–10, R1/R2.

**Evidence:** [education add/edit](../../design/artifacts/education/education-add.html) omit Currently study here; certification add omits dates present in edit; Admin has only populated/create/reset artifacts, no domain loading/error/empty/no-results states; Focus has no demonstrated reorder/primary action menu; password grant expiry, onboarding optional-record/review and resume import review/error artifacts are missing. Generic collection/form specimens exist.

**Why it matters:** a filename-level audit would falsely claim these criteria are designed. Generic specimens are necessary but do not settle domain-specific content and recovery behavior.

**Resolution:** explicitly assign missing variants to their phase, use shared generic states as the visual baseline, and require a design review before accepting the affected slice. [artifact-audit.md](artifact-audit.md) distinguishes existing references from missing states; do not require redundant full-page drawings for every simple shared state.

## P2 findings

### R21 — Token documentation disagrees with rendered foundations

**Severity:** P2. **Category:** UX. **Affected phase:** 00.

**Evidence:** [Design System](../../design/DESIGN_SYSTEM.md) says teal/blue and system/Inter; [color](../../design/artifacts/design-system/color/color.html), [type](../../design/artifacts/design-system/type-layout/type-layout.html) and CSS use indigo/Geist, including 12px surfaces outside the listed radii. **Impact:** reimplementation can look internally inconsistent. **Resolution:** Q11; recommend rendered tokens as visual authority, reconcile written tokens and decide local font delivery. Preserve full-surface toast semantics and aligned inputs/count badges.

### R22 — Search examples do not reflect query/custom-label contracts

**Severity:** P2. **Category:** UX. **Affected phase:** 03–08.

**Evidence:** [job title search](../../design/artifacts/experience/job-title-search.html) query `engineer` creates “Developer Experience Lead”; [major search](../../design/artifacts/education/major-search.html) query `comp` creates “Human-Centered AI”; [Focus edit](../../design/artifacts/focus/focus-edit.html) query `design` creates “Design Systems”. **Impact:** examples could be copied as different custom text or unexplained fallback behavior. **Resolution:** align create text with actual query/local draft and label sample search/ranking states accurately; no separate custom-save endpoint implied by Create & select.

### R23 — Admin specimen data contradicts its displayed sort and range

**Severity:** P2. **Category:** UX. **Affected phase:** 10.

**Evidence:** [users](../../design/artifacts/admin/users.html) shows five rows with “1–25 of 128”; September 10 precedes September 20 while sort says Newest. Component specimen also says Status instead of Onboarding. **Impact:** a static rendering can pass visual review while server table behavior is absent. **Resolution:** use deterministic fixtures whose visible rows/range/order agree; specify offset pagination and stable tie-breaks in the API contract. Pagination numbers are sample data, not executable evidence.

### R24 — Large seed volumes hide weak relationship diversity

**Severity:** P2. **Category:** Seeds. **Affected phase:** 03, 05–07.

**Evidence:** 1,260 institution-program rows contain only two distinct offering sets across 60 institutions (50 share 22 offerings; ten share 16). Skills tail repeats industry/template combinations; company/title sets are also reused. **Impact:** volume exercises scrolling but poorly exercises true parent scoping and relevance. **Resolution:** label mappings synthetic and avoid presenting unverified offerings as factual; curate diverse small fixtures for behavior tests, retain larger data only for development/load tests. Do not promote it to production taxonomy.

### R25 — GraphQL contract naming, errors and pagination remain too loose

**Severity:** P2. **Category:** GraphQL. **Affected phase:** 00–10.

**Evidence:** Focus spec uses `focusAreas`, architecture uses `searchFocusAreas`; Skills spec uses direct arguments vs architecture input objects and differing ID argument names. `AdminUserConnection` permits page/cursor without choosing either; auth operations/scalars/field errors are incomplete. **Impact:** hand-written client types and service semantics will drift. **Resolution:** agree SDL per slice, generate operation types, standardize IDs/input and stable field errors, choose offset for Admin, and explicitly batch provenance/catalog projections. See [api-frontend-contracts.md](api-frontend-contracts.md).

### R26 — Original traceability cannot demonstrate coverage

**Severity:** P2. **Category:** Documentation. **Affected phase:** 00, all reviews.

**Evidence:** [Traceability](../TRACEABILITY.md) has nonexistent OVR-AC IDs, an interrupted table and family-only assignments; old plan repeats drag work and allocates all primitives before consumers. **Impact:** PRO/TBL and late additions can disappear, or infrastructure can grow without a usable slice. **Resolution:** new per-criterion [coverage](../implementation/COVERAGE.md) and phase dependency gates supersede sequencing; preserve historical content with explicit banners. Add primitives with first consumers, except a minimal token/form baseline.

### R27 — Collection limits, revision policy and query shape need explicit boundaries

**Severity:** P2. **Category:** Architecture. **Affected phase:** 02–11.

**Evidence:** viewer collections in [GraphQL](../../architecture/GRAPHQL.md) have no cost contract; Profile combines multiple source previews; only focus is an ordered whole-list mutation. **Impact:** per-record fetching creates N+1, while blanket profile replacement or naive optimistic rollbacks lose unrelated changes. **Resolution:** bounded catalog/Admin inputs, batched owner-scoped profile projections, narrow revision checks for Focus/optimistic Skills and atomic last-committed-write record updates, and measured collection-size budgets. Profile cards are not tables and do not need an invented second cursor standard now; introduce incremental collection loading only with a reviewed requirement.

### R28 — Destructive feedback and operational audit are incomplete

**Severity:** P2. **Category:** Backend. **Affected phase:** 01, 04–10.

**Evidence:** [UX Standards](../../design/UX_STANDARDS.md) requires confirmation or a reversible pattern; Skills previously promised optimistic deletion and toast but no undo; Admin reset has no audit record specification. **Impact:** transport rollback is not user undo, and destructive admin actions cannot be explained later. **Resolution:** DECIDED for Skills/source removal: use immediate removal/dismissal with a brief Undo toast and restore the chip/counts on persistence failure. Retain compact confirmation for irreversible source deletion. Add minimal actor/target/action/time audit records for admin create/reset without credentials or full profile payloads; no event-stream platform needed.

## P3 findings

### R29 — Unlisted duplicate artifacts blur authority

**Severity:** P3. **Category:** Documentation. **Affected phase:** 00.

**Evidence:** `profile/overview.html`, `profile/personal.html`, and `resume/resume.html` are unlisted near-duplicate surfaces; [MANIFEST](../../design/artifacts/MANIFEST.md) describes 83 artifacts while 86 content pages exist. **Impact:** old links may lead to a separate copy that drifts. **Resolution:** mark these aliases SUPERSEDED or include their status in the manifest; preserve useful links with explicit redirects/index notes before any deletion. Generate/check manifest and gallery from one list.

### R30 — Small documentation and CSS hygiene defects

**Severity:** P3. **Category:** Tooling. **Affected phase:** 00.

**Evidence:** `.DS_Store` files are untracked but not ignored; CSS uses undefined `--brand-line` for drag affordances; shared-component index omits DataTable and PasswordInput; Resume spec has a stray `#`; UX Standards repeats Feedback. **Impact:** minor review noise, inconsistent discovery and missing drag-outline styling. **Resolution:** targeted cleanup only; no broad rewrite. Local Markdown/HTML path check found no broken documentation paths; `/src/main.tsx` is a valid Vite root path, not a broken documentation link.

## Architectural risks

Useful abstractions are module services/repositories, shared catalog mechanics, ProfileRecordDialog, typed API transport and a table controller with one real consumer. Premature abstractions would be a universal catalog/EAV repository, configurable domain-form engine, graph-normalized cache plus a second server-state store, per-domain microservices, a command bus, or an event platform. Preserve the monolith and shared database transactions. [Dependency choices](dependency-choices.md) evaluates libraries against actual interaction costs.

## Data-model risks

The most expensive later repairs would be cross-owner catalog relationships, unconstrained polymorphic provenance, conflating setup with onboarding, ambiguous date precision, changing normalization after unique indexes, and overwriting focus order concurrently. [Data contracts](data-contracts.md) specifies proposed keys, checks, FK/delete behavior, indexes, timestamp/enum choices and transaction boundaries for every planned table. No schema or migration was created.

## Product/documentation inconsistencies

Q01–Q12 below are decision gates, not permission to implement a preferred interpretation. Product status remains unchanged because no implementation occurred; the page inventory adds the approved inferred-source-details state. Application shell is present in FEATURE_STATUS but omitted from the PRD initial-scope link list; its appended requirements remain confirmed and covered. The old raw-SQL bootstrap is an acknowledged transitional implementation under ADR 0009, not a competing accepted raw-pg architecture.

## UX/design inconsistencies

See R06–R10, R14–R15 and R20–R23. Focus is confirmed as flexible and optionally primary, with no top-five cap; whether its searchable editor is inline or a dialog is not settled by its wording (“rather than a modal checklist”) and the current dialog artifact. Q08 includes confirming this presentation without confusing a searchable modal with a checklist. Existing Back to Profile actions and single CTAs should be preserved.

## Security concerns

R01 is the blocker. R02/R03/R12 cover ownership and lifecycle enforcement. R18 exposes operational errors/connection credentials and needs cleanup before shared use. Development fixture passwords are intentionally public examples, not discovered user secrets; they must never become production accounts or plaintext database fields. Admin list projections expose only approved identity/status metadata, never private catalog definitions or arbitrary profile details.

## Accessibility concerns

Require WCAG 2.2 AA-oriented checks: keyboard operation (2.1.1), focus order/visibility and non-obscuring overlays (2.4.3/2.4.7/2.4.11), dragging alternative (2.5.7), target size/spacing (2.5.8), labels/error associations (3.3.1/3.3.2), names/roles/values (4.1.2), status announcements (4.1.3), contrast/reflow (1.4.3/1.4.10/1.4.11). These are planned checks, not a compliance certification. Source/visual review cannot prove screen-reader behavior. Use real VoiceOver/keyboard review plus automated checks; enforce dialog focus restoration, combobox active descendant, non-drag removal and menu movement. See [W3C combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) and [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Testing gaps

Only two smoke tests exist. There is no demonstrated product test coverage, repository integration harness, seeded concurrent-write test, CI, browser interaction suite or accessibility run. The new coverage matrix lists **planned evidence**, never claims passing tests. Phase 00 isolates tests; every slice carries negative ownership, failure/retry and domain invariants; Phase 11 closes release journeys rather than postponing all quality work.

## Seed-data concerns

[Seed audit](seed-audit.md) contains measured counts and validation results. Volumes meet stated ranges; correctness and diversity need work. Loader determinism/idempotence is unproven because no loader exists. Keep immutable catalog upserts separate from user fixture reset so rerunning seeds cannot overwrite a developer's edited profile or password.

## Tooling concerns

R16–R18 are concrete issues. `.codex/config.toml`'s `agents.enabled` and `max_concurrent_threads_per_session` and standalone `.codex/agents/*.toml` are supported in the current [official configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) and [subagent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents); do not “fix” them using older `max_threads` advice. The custom roles are visible in this session. Role ownership is sensible; read-only planner/architect/reviewer roles intentionally return recommendations for the primary writer. No model pinning, unrelated permissions expansion, or new agent tooling is justified.

## Recommended decisions before implementation / open questions

| ID | Decision owner / deadline | OPEN QUESTION and recommended direction |
| --- | --- | --- |
| Q01 | Product + security; before password-setup slice 01B | What proves control of a passwordless/reset account? Approve trusted-channel one-use link or another explicit proof flow. |
| Q02 | Resolved 2026-09-21 | Derived-supported `×` dismisses from Skills while preserving sources; reviewed mappings attach automatically. Dismissals persist across source saves and manual re-add restores visibility. |
| Q03 | Product; before 04 | Which deterministic custom-skill classifier/fallback is valid, or should the input contract change? |
| Q04 | Product + design; before 02C only for additional resume guarantees | Follow the seven-step feature spec and required fields. Is an exact saved-step resume position required beyond persisted profile values? Do not add a progress store without that requirement; reconcile stale artifacts. |
| Q05 | Resolved 2026-09-21 | Resume Tools is an active initial-release Profile capability, delivered with R1/R2 rather than a placeholder in Phase 02. |
| Q06 | Product; before 02 | Supported profile enums, title/completeness source, and Settings password-change scope. Recommend no invented metrics; add AC for any new password action. |
| Q07 | Product + data; before 05 | Month/day precision, nullability and education status/current combinations. Recommend explicit month precision. |
| Q08 | Product + architecture; lexical/identity rules before 03, parent rules before 05–07 | Rank tie-breaks, exact normalization, parent validity and strict board scope. A searchable Focus dialog already fits its specification; no new editor-mode gate. |
| Q09 | Design; before 02 | Drawer vs old bottom subsection navigation. Recommend same primary destinations in responsive drawer. |
| Q10 | Product + security; before R1/R2 | Resume retention/providers/review/merge and factual-content limits. This gates planned initial-release work. |
| Q11 | Design; before first styled auth UI in 01 | Rendered indigo/Geist or written teal/Inter foundation? Recommend reconcile docs to rendered tokens. |
| Q12 | Resolved 2026-09-21 | Use immediate removal/dismissal with a brief Undo toast; persistence failures still restore the prior chip/counts. |

Engineering should approve proposed data/API/dependency contracts at the relevant phase checkpoint. This review does not ask the user to decide every local implementation detail. Foundation tooling is independent of Q01/Q11. Q01 gates setup/reset only; Q11 gates styled UI. Review each bounded slice using [REVIEW_SLICES](../implementation/REVIEW_SLICES.md), resolving downstream questions only before their affected work.

## Go / conditional-go / no-go statement

**Conditional-go** to separately authorize Phase 00 after reviewing this packet. **No-go** for insecure email-only password setup and for calling the starter implementation-ready as a complete product. Initial release requires Phases 00–10, R1/R2, 11 and their gates. No feature, dependency, resolver, component or migration was implemented by this review.
