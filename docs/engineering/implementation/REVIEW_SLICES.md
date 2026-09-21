# Reviewable delivery slices

Status: **PLANNED; none implemented or tested.** Phase numbers remain stable as milestones. The rows below are separate review units, not a requirement to deliver an entire phase in one PR. Every behavioral slice includes its narrow DB/API/UI path, negative ownership cases, failures and acceptance evidence; do not split by technical layer. Infrastructure-only 00 is the deliberate exception.

A slice is too large if its reviewer cannot follow one user action, its transaction and its failure behavior together. Split at another user action before adding unrelated capability. Database migrations stay additive while later consumers are absent. Partial milestones are development checkpoints, not permission to publish incomplete features. Full criterion completion is tracked in [COVERAGE](COVERAGE.md).

| Slice | Concrete deliverable and review boundary | Gate / evidence |
| --- | --- | --- |
| 00A | Reproducible runtime, lockfile, build and isolated verification | Clean install/build; verify owns and cleans its process/DB; no credentials in failures. |
| 00B | Minimal Yoga/Fastify adapter and one Drizzle migration workflow | Real request/error test and empty DB/rerun; no domain UI or speculative client tooling. |
| 01A | Register, sign in/out, viewer/session and incomplete-user guard | AUTH-AC-001–004/007; fixture routing for 008, cookies/CSRF/throttles; Q11 for styled UI. Q01 does not block this slice. |
| 01B | Approved proof-based password establishment and credential invalidation | Q01; AUTH-AC-005/006 service/form evidence, expiry/replay/reset race. Admin issuance/action UI remains 10B/10C. |
| 02A | Account personal fields: read/edit/cancel with owner validation | PER-AC-001–005; Q06 fields, required values and URL/date negatives. |
| 02B | Profile shell, navigation and static command list | APP criteria and Profile shell criteria; Q09; role/context keys, modal focus, reload/back and mobile. Later domain commands, including Resume Tools, stay explicitly partial until their functional phases. |
| 02C | Seven-step onboarding frame, personal/career save and explicit finish after optional skips | Required names/country/language cannot be bypassed; timestamp once; register → skip optional sections → Profile. Reuse 02A fields. Optional editors are integrated as they arrive, and the complete onboarding feature is not yet accepted. No invented stored-step cursor. |
| 03A | View/count lanes and search global skills | SKL-AC-001–004; real ranked query, bounded results, stale-response/keyboard tests. Minimal CatalogCombobox consumer. |
| 03B | Add catalog skill and reload it at Intermediate | SKL-AC-005/006; persisted MANUAL source, duplicate race; preserve proficiency on source attachment. Onboarding adapter can use the same add service, but its full chip acceptance waits for 04C. |
| 04A | Create a private custom skill atomically | Q03; SKL-AC-007/008/013, cross-owner lookup and normalized collision; canceled draft writes nothing. |
| 04B1 | Change proficiency with the keyboard Move menu | Same operation/optimistic rollback contract later used by drag; stale response cannot undo newer success. SKL-AC-010 remains partial. |
| 04B2 | Pointer/touch drag between allowed lanes | Drag spike/package gate; SKL-AC-010–012, reload persistence, cross-category rejection, cancel and touch scroll. No new proficiency service. |
| 04C | Remove/dismiss with Undo and inferred source details | SKL-AC-009/015–017 and ONB-AC-008. Onboarding manual chips disappear immediately; derived-supported chips persist dismissal and disappear; failure restores chip/counts. Test named treatments and hover/focus/touch source details. |
| 05A | Add/view Work using real Company/Title catalogs and dates | Q07/Q08; EXP-AC-001–008. Company schema and seeds start here. First owning dependent form, onboarding composition, normalization/visibility helper extraction from two actual consumers. |
| 05B | Edit/delete Work and custom company/title persistence | EXP-AC-003–005/009; ownership, custom cancel/rollback, parent changes; explicit domain fields in the specified dialog. |
| 05C | Automatic Work-derived links and associated-skill preview | EXP-AC-010/011 and first SKL-AC-014 evidence. Record save attaches reviewed mappings without confirmation; edit changes only its own links; delete preserves MANUAL/another Work source and dismissal; failure rolls back record and links. |
| 06A | Add/view Education with ordered catalog hierarchy | EDU-AC-001–005/007; status/year rules, real saved global selections and onboarding adapter. |
| 06B | Education custom selections, edit/delete and parent invalidation | EDU-AC-004/006/008; scoped triples, canceled custom drafts, foreign ownership and stale child query. |
| 06C | Automatic Education-derived links and preview | EDU-AC-009. Record save attaches reviewed mappings without confirmation. Extract common source reconciliation once two concrete source consumers exist; preserve Work/MANUAL links and dismissals. |
| 07A | Add/view Certification using Board → Exam and optional metadata | CERT-AC-001–004/006; strict-board decision, dates/URL, onboarding adapter. |
| 07B | Custom board/exam, edit/delete and dependent invalidation | CERT-AC-003/005/007; wrong-board constraint, foreign IDs, canceled drafts and rollback. |
| 07C | Automatic Certification-derived links and preview | CERT-AC-008; record save attaches reviewed mappings without confirmation; preserve other source types and dismissals, completing SKL-AC-014 only after all three actual source domains pass. |
| 08A | Select/save global and private Focus areas | FOC-AC-001–003/006; no five-item cap, viewer privacy and atomic custom resolution; onboarding adapter. |
| 08B | Order, remove and optional Primary in the same editor | FOC-AC-004–006; lock/revision conflict, primary removal leaves none, keyboard order persists across sessions. No extra drag library required. |
| 09A | Complete onboarding composition and data parity | ONB-AC-001–008; all optional editors already exist. Back/skip preserve saved data; retry retains drafts; immediate skill ×; shared illustration on every desktop step. |
| 09B | Cross-account first-access/reset and reentry journeys | AUTH-AC-008 plus onboarding criteria; incomplete guards, completion timestamp once, complete reset account returns to Profile. Admin-created full journey also runs after 10B. |
| 10A | Admin list with server search/filter/sort/page | ADM-AC-001/002/005 and TBL-AC-001–006; count/range consistency, URL/back, tied ordering, empty/no-results/error and mobile table. Keep controller local. |
| 10B | Admin creates USER/ADMIN and delivers approved setup proof | Q01; ADM-AC-003/004/007, one Create action, duplicate email race, audit, first password then 02C onboarding. |
| 10C | Admin reset with independent onboarding state | ADM-AC-006; confirmation, audit, old-session revocation and reset/login race. Reuse 01B lifecycle, no second credential system. |
| 11A | Coverage and cross-domain acceptance audit | Actual paths/results for every approved initial AC, including Resume; blocked work is not passed. Revisit contextual commands/mobile sections as real features exist. |
| 11B | Deployment readiness and operational recovery evidence | Build/migrate/seed, cookies/origins, bounded queries/log redaction, selected-host backup/restore. No deployment or speculative purge feature. |
| R1A | File acceptance and durable import status | RES-AC-001/002; Q10 gate; owner/file/error/retention tests. |
| R1B | Candidate review and explicit merge | RES-AC-003/004; idempotent merge and typed import-source FK. |
| R2A | Saved-snapshot generation and retry | RES-AC-005/006/010; Q10, grounded source fields, owner access and failure. |
| R2B | Preview/download | RES-AC-007–009; same immutable generated output and documented single-column hierarchy. |

## Integration and completion rules

- A domain form and its onboarding use are reviewed together. Phase 09 must not discover new domain schemas, generic form engines or missing save contracts.
- Work is not a prerequisite for Education or Certification as a product. If scheduled differently, the first actual record form implements the small dialog; the second extracts shared reconciliation. Do not build an abstract framework to unlock parallel scheduling.
- CAT-AC-001–010 require evidence across all nine eligible catalogs. Skills has no parent; dependent behavior starts with Work, then three-level Education and board-scoped Certification. Each owning form proves cancel/no-orphan behavior; a shared combobox test alone is insufficient.
- PRO-AC-002 completes with Work/Skills/Education/Certifications, not Focus. PRO-AC-009/011 and APP-AC-004 remain partial until real domain surfaces and commands have been checked. Final checks belong to 11A, not merely the shell scaffold.
- All derived phases test two different records of the same type as well as cross-type sources. No single-source fixture can prove SKL-AC-014.
- No ordinary source write, classification or mapping application may make a remote provider call inside a database transaction. Future import uses the same typed source attachment semantics without changing definition origin or resetting proficiency.
