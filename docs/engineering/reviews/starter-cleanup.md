# Starter cleanup plan

Status: **PLANNED**. No item below authorizes or records execution of Phase 00. These are concrete issues found in the supplied repository; findings and rationale are in [architecture-readiness.md](architecture-readiness.md).

| File/path | Current issue | Desired state | Phase | Kind / finding |
| --- | --- | --- | --- | --- |
| `package.json`, `api/package.json`, `scripts/migrate.mjs`, `scripts/verify.mjs` | Root scripts import API-only pg | API-owned DB entry points; root forwarding scripts, isolated pnpm resolution | 00 | Code/config; R16 |
| `db/migrations/001_init.sql`, `scripts/migrate.mjs`, missing Drizzle config/schema/journal | No-op SQL with custom migration history | One reviewed Drizzle workflow; documented bootstrap-history transition before domain SQL | 00 | Code/config; R16 |
| `pnpm-lock.yaml` (missing), manifest engines, API Node types | No reproducible graph; Node range includes incompatible jsdom runtime; types target newer Node | Tested Node 24 patch >=24.15; aligned types; frozen-lockfile install | 00 | Code/config; R17 |
| root/API/web manifests | No build commands or CI | Build/typecheck/test/GraphQL smoke scripts and CI with disposable PostgreSQL | 00 | Code/config; R17/R18 |
| `.env.example`, `api/src/db.ts`, `api/src/server.ts` | Env template not loaded, permissive fallback, no pool shutdown | Explicit env loading/validation, documented local defaults only, fail-closed deployed config, graceful close | 00 | Code/config; R17 |
| `scripts/verify.mjs` | Uses configured DB, may inspect unrelated API port, credential URL in failures, exit may bypass cleanup | Disposable validation target, owned unique API instance, sanitized errors, reliable cleanup; separate destructive/reset commands | 00 | Code/config; R18 |
| `api/src/routes/health.routes.ts`, `api/src/health.spec.ts` | Raw DB error and 200 on failure; test accepts unhealthy DB | Sanitized liveness/readiness policy; injected DB dependency; positive/negative health tests | 00 | Code/config; R18 |
| `api/src/app.ts` | Logger disabled; no Yoga integration/context/error redaction | Minimal tested GraphQL transport and redacted structured logging | 00 | Code/config; R12 |
| `web/src/App.tsx`, `Home.tsx`, `Home.spec.tsx` | Health-only scaffold/test | Keep honest scaffold until relevant slices; introduce routes/transport when consumer arrives, real behavior tests | 00–02 | Code/config; R18 |
| `docs/engineering/IMPLEMENTATION_PLAN.md`, `TRACEABILITY.md` | Wrong onboarding/provenance order, nonexistent OVR family, incomplete matrix | Mark historical sequencing SUPERSEDED; route readers to new phases/coverage | This review | Documentation; R06/R26; banners/index links only |
| `docs/README.md` | No readiness/planning packet links | Link report, cleanup, new plan and coverage | This review | Documentation |
| `README.md` | Default prompt references former Phase 0 sequencing | Point readers to review/new Phase 00; preserve setup description until code changes actually land | 00 | Documentation; R26 |
| Authentication/Admin specs, SECURITY.md, set-password artifact | No safe setup proof | Approved Q01 contract and activation/expiry/error states; independent onboarding | Before 01B | Documentation first, code later; R01 |
| DATA_MODEL.md, GRAPHQL.md | Missing ownership/FK/concurrency/date/input detail | Adopt reviewed per-phase contracts; do not indiscriminately rewrite all architecture docs | 00–08 | Documentation first; R02/R03/R09/R11/R25 |
| Skills spec and derived-skills flow | Custom-skill classification remains unresolved; removal, dismissal, automatic derivation, Undo, and inferred source details are decided | Q03 decision remains before 04; SKL-AC-017 owns inferred presentation | Before 04 | Documentation; R04/R05/R28 |
| Profile/Resume/Shell specs and PAGE_INVENTORY | Resume release classification conflicted with the active initial chooser requirement | Resume is active initial-release scope; R1/R2 deliver the CTA and flows, with Q10 gate | Before R1/R2 | Documentation; R07 |
| Personal info spec and Account/Profile artifacts | Missing editable fields, unsupported settings action/completeness | Q06 scope and complete forms; no fabricated metric | Before 02 | Documentation/artifacts; R08 |
| Onboarding spec/flow/wireframe/artifacts | Seven-step intent vs four-step designs | Q04 resolution, missing states, skip/required rules and resume behavior | 02C, then each domain; final 09 | Documentation/artifacts; R06 |
| Catalog search docs and selector specimens | Ambiguous ranking/parent validity, mismatched custom text | Q08 golden examples, strict board decision, consistent draft values | 03 lexical/identity; 05–07 parent rules | Documentation/artifacts; R10/R22 |
| Work/Education/Certification specs and forms | Precision/nullability gap, missing current-study/add-date controls | Q07 and complete domain forms/recovery states | Before 05–07 | Documentation/artifacts; R09/R20 |
| Mobile shell/Skills/Profile/Admin artifacts and NAVIGATION | Conflicting mobile destinations, missing actual drawer, table overflow | Q09, responsive state of same shell and named table-scroll region | 02/10 | Documentation/artifacts; R15 |
| DESIGN_SYSTEM.md, `assets/styles.css`, foundation artifacts | Indigo/Geist vs teal/Inter; undefined drag color variable | Q11 approved token table; defined drag outline; consistent radius/font policy | 01 tokens; 04 drag | Documentation/artifacts; R21/R30 |
| Palette and Skills editor artifacts/scripts | Missing full keyboard/Move demonstration | Explicit specimen limitations or complete approved interaction examples; never claim production AC passed | 02/04 | Documentation/artifacts; R14 |
| Admin artifacts | Sort/range mismatch; absent loading/error/no-results | Consistent fixtures; required shared state composition | 10 | Documentation/artifacts; R20/R23 |
| `db/seeds/profile-fixtures.seed.json` | Missing Communication definition; label references; dangling custom examples | Stable references and deliberate same-owner custom/derived fixtures | 03–08 | Data/config; R13 |
| `db/seeds/users.seed.json`, missing loader | No passwordless/reset fixtures, no deterministic execution | Development-only hashed credentials, setup/reset users, explicit idempotent/reset modes | 01–10 | Data/code; R13 |
| Institution programs/company links/skills seed catalog | Synthetic repeated relationships/templates | Label synthetic demo data, curate distinct small test mappings, verify any factual offered-here claims | 03–07 | Data/documentation; R24 |
| Generated Resume preview and source fixtures | Unsupported achievements, mismatched certificate | Grounded identical snapshot examples and explicit omitted-fact behavior | R2 | Documentation/artifacts; R19 |
| `artifact-manifest.json`, MANIFEST, all-pages/index | Three unlisted duplicate surfaces | Explicit alias/SUPERSEDED status, single generated index source | 11 documentation hygiene | Documentation/artifacts; R29 |
| `.gitignore`, `.DS_Store`, docs/.DS_Store | OS metadata noise | Ignore OS metadata; exclude it from future initial commit | 00 | Config; R30; do not delete unrelated local files |
| Component index, UX_STANDARDS, resume spec | Missing index links, duplicate heading, stray heading | Small targeted prose/index cleanup | 11 documentation hygiene | Documentation; R30 |

## Preserve

Do not remove the pg driver, change Fastify/Yoga, install a second package manager, replace the accepted ADRs, or erase provenance distinctions. Do not rewrite current valid Codex configuration using outdated schema advice. Keep domain fields explicit instead of adding generic repository/form engines. Preserve existing local/user files and the uncommitted starter; obtain normal review before any later commit. No cleanup was performed on source, configuration, seeds or artifacts in this task.

## Cleanup acceptance

Phase 00 closes its rows with a locked compatible install, isolated commands, safe configuration, Drizzle baseline transition, successful build/typecheck/tests/GraphQL smoke, and links that point to current planning. Rows assigned to later slices remain visible in phase risks/gates rather than disappearing under a blanket “foundation done”. Product/visual decisions update their owning specs only after approval.
