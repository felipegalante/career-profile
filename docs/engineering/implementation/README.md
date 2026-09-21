# Revised implementation plan

Status: **IN PROGRESS**. This plan is the output of the [architecture readiness review](../reviews/architecture-readiness.md); it supersedes the earlier delivery sequence in `../IMPLEMENTATION_PLAN.md`, not product requirements or accepted ADRs. **Phase 00 is complete pending human review.** All product implementation remains Not Started. Resume import and generation are planned initial-release phases, gated by Q10.

## Read first

1. [Readiness and decision register](../reviews/architecture-readiness.md), especially R01 and Q01–Q12.
2. [Starter cleanup](../reviews/starter-cleanup.md), [data contracts](../reviews/data-contracts.md), [API/frontend contracts](../reviews/api-frontend-contracts.md), [dependency choices](../reviews/dependency-choices.md).
3. [Artifact audit](../reviews/artifact-audit.md), [seed audit](../reviews/seed-audit.md), [dependencies](DEPENDENCIES.md), [criterion coverage](COVERAGE.md).
4. The exact feature spec, design references, applicable ADRs and phase document before implementation.

## Delivery order

| Phase | Deliverable / independently reviewable slice | Status |
| --- | --- | --- |
| [00 Foundation](phase-00-foundation.md) | Reproducible runtime, safe verification and minimal Yoga/Drizzle wiring | IN REVIEW |
| [01 Authentication](phase-01-authentication.md) | Separate session and approved password-setup slices | PLANNED; Q01 gate |
| [02 Profile and shell](phase-02-profile-foundation.md) | Account/Profile, shell, and an early required-fields onboarding journey | PLANNED |
| [03 Catalog skill slice](phase-03-catalog-infrastructure.md) | Search → add catalog skill → reload, with MANUAL provenance | PLANNED |
| [04 Skills core](phase-04-skills.md) | Separate custom-skill, proficiency/drag, and removal slices | PLANNED; Q03 gate |
| [05 Work Experience](phase-05-work-experience.md) | Company/title form, CRUD and first real derived-source reconciliation | PLANNED |
| [06 Education](phase-06-education.md) | Institution/program hierarchy, dates/status and education provenance | PLANNED |
| [07 Certifications](phase-07-certifications.md) | Board-scoped certification records and provenance | PLANNED |
| [08 Professional Focus](phase-08-professional-focus.md) | Private/global selection, persisted order and optional primary | PLANNED |
| [09 Onboarding](phase-09-onboarding.md) | Finish and verify onboarding integrated incrementally in 02–08 | PLANNED |
| [10 Admin Users](phase-10-admin-users.md) | Server-backed table, account creation/reset UI and audit | PLANNED |
| [R1 Resume import](phase-r1-resume-import.md) | Durable import, review and explicit merge | PLANNED; Q10 gate |
| [R2 Resume generation](phase-r2-resume-generation.md) | Grounded snapshot generation, preview and download | PLANNED; Q10 gate |
| [11 Release validation](phase-11-release-hardening.md) | Cross-domain release journeys, accessibility, security, query and deployment evidence | PLANNED |

Each phase is a milestone, **not one PR**. [Reviewable slices](REVIEW_SLICES.md) defines smaller deliverables, gates and evidence. Numbers give a review-friendly default order; actual dependencies are in DEPENDENCIES. Admin and Focus can be implemented earlier after their prerequisites, but do not silently broaden an authorized phase. Education and Certifications are separate reviews, not one large form/database batch. R2 does not require import; both Resume phases must complete before release validation.

## Why this differs from the previous plan

- Phase 00 establishes only reusable infrastructure needed immediately. Build the command palette with the shell, a fixed Admin table with Admin, and the specified dialog with real record fields. Extract domain-independent logic only when a second concrete consumer demonstrates the common contract.
- Establish profile identity and guarded shell before full onboarding. Incomplete users remain guarded; developers use complete test fixtures to review intermediate Profile slices. Do not bypass ONB-AC-001 in production to make intermediate demos convenient.
- Introduce MANUAL provenance with the persisted catalog-skill slice in 03, before Experience/Education/Certification attach sources. Every source slice owns its final deletion/derivation behavior; no late retrofit of a polymorphic ID model.
- Implement catalog interaction with a saved Skills action, then extract shared server mechanics when the second catalog consumer arrives. Company tables and dependent selectors arrive with Work in 05. Load each domain's schema/seeds with its consumer, not all domain tables before any usable slice.
- Deliver required personal fields and completion early in 02; integrate each optional domain into onboarding in its own slice. Phase 09 validates the complete journey instead of discovering form/service reuse problems at the end. The seven-step feature spec owns the sequence; reconcile the four-step artifacts to it.
- Resume import and generation are initial-release scope. Their storage, job, parser/model/provider, retention, factual-content and merge decisions remain Q10 gates; do not begin either phase with placeholder integrations.

## Gates and definition of done

Foundation runtime work does not depend on password-setup or visual decisions. Q01 gates setup/reset slice 01B; Q11 gates the first styled auth UI in 01A. Other OPEN QUESTION gates close only before the affected slice. A phase is complete only when its AC, negative ownership tests, failure states, applicable DB constraints and human review pass; a partial slice does not claim a whole family complete. Each phase has explicit acceptance and review sections.

Every code phase runs relevant tests, `pnpm typecheck`, `pnpm test`, and `pnpm verify` when its environment is available. Database phases additionally prove clean migration plus repeat migration/seed behavior. Record exact command outcomes and limitations; never label tests passing because only a static artifact works. Include actual pointer drag and keyboard alternatives, not one in place of the other.

No phase may silently resolve a product conflict. Record approved behavior in the feature spec, visual conventions in design docs, significant technical changes in architecture/ADRs, and update FEATURE_STATUS/PAGE_INVENTORY/coverage on delivered scope. New AC proposed in the review are marked OPEN QUESTION until assigned real IDs by the owner. Existing 124 real AC are enumerated in COVERAGE; template XXX-AC is excluded.

## Review ownership

Product owns behavior and scope gates; design owns states and visual/accessibility review; engineering owns service/API/schema constraints and compatible dependency selection; QA reviews acceptance evidence. These are responsibilities, not a requirement to create additional agents or services. Review each slice independently; aggregate milestone acceptance follows after its remaining criteria pass. Cross-domain journeys retain named completion owners.

## Planning packet validation and changed files

The first-pass review created 24 Markdown files: the 14 phase documents above, this README, DEPENDENCIES, COVERAGE, and the seven review documents linked under Read first. It updates only three existing text files: `docs/README.md` (index), `docs/engineering/IMPLEMENTATION_PLAN.md` and `docs/engineering/TRACEABILITY.md` (historical/superseded banners).

First-pass validation checked all 14 phase documents for the 15 requested sections, exact coverage of all 123 real AC without missing/duplicate IDs, severity totals, and all local output links. Baseline content hashes confirm no application, configuration, seed or design-artifact content changed; incidental `.DS_Store` metadata changes are excluded. Product specs/statuses and ADRs remain unchanged. No product implementation, dependency installation or migration execution occurred. Runtime verification stopped before DB access because dependencies were absent; it is not reported as passing.

## Second-pass review

The principal-engineer pass corrects the report and contracts in place and adds [REVIEW_SLICES](REVIEW_SLICES.md). It changes only planning documents. All phases remain PLANNED and no feature or test is implemented. The report's second-pass table records the reasons; the coverage matrix contains concrete planned scenarios and explicit outstanding gates.

Second-pass validation: all 123 AC IDs match their feature specs exactly once; all 14 phase documents retain the requested sections; 637 local links resolve; the dependency graph is acyclic. Content hashes confirm that only 22 existing planning files and the new slice document changed. Source, configuration, seeds, product/design specifications and ADRs are unchanged. No runtime tests, installation or migrations were run for this documentation-only pass.

## 2026-09-21 derived-skills planning decision update

Product closed Q02 and Q12 after the second-pass review. This update adds SKL-AC-017, bringing the current coverage total to 124 criteria, and changes the owning Skills/source specifications, design flow/wireframe/system, page inventory, data contract, coverage, and affected phase plans. It records persistent derived-skill dismissal, automatic reviewed mappings, inferred source treatments, accessible source details, and Undo. No application code, migration, dependency, seed, or runtime test changed.

## 2026-09-21 Resume scope decision update

Product moved Resume import and generation into the initial release. R1 and R2 remain named Resume phases for continuity, but are PLANNED rather than deferred and run before Phase 11 release validation. Q05 is resolved in favor of an active Resume Tools CTA delivered with the feature; Q10 remains the required product/security gate for implementation details. No application code, migration, dependency, seed, or runtime test changed.
