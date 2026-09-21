# Requirement Traceability

> **SUPERSEDED matrix (2026-09-20).** The current [coverage matrix](implementation/COVERAGE.md) enumerates all 124 actual acceptance criteria, design references, phases, layer coverage and planned tests. The historical matrix below contains an obsolete OVR family and old phase assignments; retain it only as audit context. See [R26](reviews/architecture-readiness.md#r26--original-traceability-cannot-demonstrate-coverage). No product criteria are claimed implemented by this update.

| Criteria family | Phase | Primary tests |
| --- | --- | --- |
| APP-AC-* | 0 / 3 | AppShell shortcut + CommandPalette component/integration tests |
| AUTH-AC-* | 1 | service/API + auth forms |
| CAT-AC-* | 2 | DB/search/API + shared combobox |
| ONB-AC-* | 3 | GraphQL + routed journey |
| OVR-AC-* | 3 | frontend/viewer integration |
| PER-AC-* | 3 | profile service/API + form |
| FOC-AC-* | 3 | focus service + searchable/reorder UI |
| EXP-AC-* | 4 / 7 provenance | catalog dependencies + CRUD + provenance |
| EDU-AC-* | 5 / 7 provenance | program dependencies + CRUD + provenance |
| CERT-AC-* | 5 / 7 provenance | board/exam dependencies + CRUD + provenance |
| SKL-AC-* | 6 / 7 provenance | search/database/API + accessible Skills UI |
| ADM-AC-* | 8 | authorization/API + admin UI |
| RES-AC-* | R1/R2 | defined with implementation architecture |

| TBL-AC-* | Phase 0/8 | DataTable unit/component + Admin GraphQL integration |
| AUTH-AC-005/006 | Phase 1/8 | password-setup/reset integration |
| PRO-AC-* | Phase 3 | Profile workspace component/integration |

- `RES-AC-008`–`RES-AC-010`: generated resume preview/layout and content-grounding checks (planned Resume phase).

- `SKL-AC-015` / `SKL-AC-016`: Phase 6 Skills; frontend interaction tests + GraphQL integration rollback/error coverage.
- `ONB-AC-007`: Phase 3 Onboarding; visual artifact review + responsive frontend coverage.
