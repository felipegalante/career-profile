import { describe, expect, it } from "vitest";
import type { CoverageRow, CoverageStatus } from "./coverage.ts";
import type { AcceptanceCriterion } from "./criteria.ts";
import { checkEvidence, type TaggedTest } from "./evidence.ts";

const criteria: AcceptanceCriterion[] = ["AUTH-AC-001", "AUTH-AC-002"].map((id) => ({ id, feature: "authentication", text: "Text." }));
const rows = (...statuses: CoverageStatus[]): CoverageRow[] => statuses.map((status, index) => ({ id: criteria[index]!.id, status, line: index + 10 }));
const tagged = (name: string, ...tags: string[]): TaggedTest => ({ suite: "api", file: "api/src/auth/auth.spec.ts", name, tags });

describe("acceptance evidence", () => {
  it("collects the tests citing each criterion and ignores tags that are not criteria", () => {
    const registers = tagged("registers", "@AUTH-AC-001", "@visual");
    const report = checkEvidence({ criteria, coverage: rows("IN REVIEW", "PLANNED"), tests: [registers, tagged("untagged")] });

    expect(report.errors).toEqual([]);
    expect(report.evidence).toEqual(new Map([["AUTH-AC-001", [registers]]]));
  });

  it("fails a criterion whose status claims evidence that no test provides", () => {
    const report = checkEvidence({ criteria, coverage: rows("IN REVIEW", "PARTIAL"), tests: [tagged("registers", "@AUTH-AC-001")] });

    expect(report.errors).toEqual(["COVERAGE.md:11: AUTH-AC-002 is PARTIAL, but no test is tagged @AUTH-AC-002."]);
  });

  it("fails a test that cites a criterion no spec defines", () => {
    const report = checkEvidence({ criteria, coverage: rows("PLANNED", "PLANNED"), tests: [tagged("registers", "@AUTH-AC-099")] });

    expect(report.errors).toEqual(["api: api/src/auth/auth.spec.ts > registers cites @AUTH-AC-099, which no feature spec defines."]);
  });

  it("fails when the matrix and the specs disagree about which criteria exist", () => {
    const coverage: CoverageRow[] = [
      { id: "AUTH-AC-001", status: "PLANNED", line: 10 },
      { id: "AUTH-AC-001", status: "PLANNED", line: 11 },
      { id: "AUTH-AC-099", status: "PLANNED", line: 12 },
    ];

    expect(checkEvidence({ criteria, coverage, tests: [] }).errors).toEqual([
      "COVERAGE.md:11: AUTH-AC-001 already has a row at line 10.",
      "COVERAGE.md:12: AUTH-AC-099 is not defined by any feature spec.",
      "AUTH-AC-002 (authentication.md) has no row in COVERAGE.md.",
    ]);
  });

  it("notes tests for a criterion the matrix still lists as planned without failing", () => {
    const report = checkEvidence({ criteria, coverage: rows("PLANNED", "PLANNED"), tests: [tagged("registers", "@AUTH-AC-001")] });

    expect(report.errors).toEqual([]);
    expect(report.notices).toEqual(["AUTH-AC-001 is PLANNED in COVERAGE.md, but 1 test(s) are tagged @AUTH-AC-001."]);
  });
});
