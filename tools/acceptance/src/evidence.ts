import { CRITERION_ID, type AcceptanceCriterion } from "./criteria.ts";
import { EVIDENCE_STATUSES, type CoverageRow } from "./coverage.ts";

export type TaggedTest = { suite: string; file: string; name: string; tags: string[] };

export type EvidenceReport = {
  /** Contradictions between the specs, the coverage matrix and the tests. */
  errors: string[];
  /** Tests that cite a criterion the matrix does not yet claim; worth a status update, not a failure. */
  notices: string[];
  /** The tests citing each criterion. */
  evidence: Map<string, TaggedTest[]>;
};

export function checkEvidence(input: { criteria: AcceptanceCriterion[]; coverage: CoverageRow[]; tests: TaggedTest[] }): EvidenceReport {
  const errors: string[] = [];
  const notices: string[] = [];
  const known = new Set(input.criteria.map((criterion) => criterion.id));
  const evidence = new Map<string, TaggedTest[]>();

  const rows = new Map<string, CoverageRow>();
  for (const row of input.coverage) {
    if (!known.has(row.id)) errors.push(`COVERAGE.md:${row.line}: ${row.id} is not defined by any feature spec.`);
    const earlier = rows.get(row.id);
    if (earlier) errors.push(`COVERAGE.md:${row.line}: ${row.id} already has a row at line ${earlier.line}.`);
    else rows.set(row.id, row);
  }
  for (const criterion of input.criteria) {
    if (!rows.has(criterion.id)) errors.push(`${criterion.id} (${criterion.feature}.md) has no row in COVERAGE.md.`);
  }

  for (const test of input.tests) {
    for (const tag of test.tags) {
      const id = tag.replace(/^@/, "");
      // Other tags, such as @visual, are not criterion citations.
      if (!CRITERION_ID.test(id)) continue;
      if (!known.has(id)) {
        errors.push(`${test.suite}: ${test.file} > ${test.name} cites @${id}, which no feature spec defines.`);
        continue;
      }
      evidence.set(id, [...(evidence.get(id) ?? []), test]);
    }
  }

  for (const row of rows.values()) {
    const cited = evidence.get(row.id)?.length ?? 0;
    if (EVIDENCE_STATUSES.has(row.status) && cited === 0) {
      errors.push(`COVERAGE.md:${row.line}: ${row.id} is ${row.status}, but no test is tagged @${row.id}.`);
    } else if (!EVIDENCE_STATUSES.has(row.status) && cited > 0) {
      notices.push(`${row.id} is ${row.status} in COVERAGE.md, but ${cited} test(s) are tagged @${row.id}.`);
    }
  }

  return { errors, notices, evidence };
}
