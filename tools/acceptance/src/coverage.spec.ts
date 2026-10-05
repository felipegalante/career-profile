import { describe, expect, it } from "vitest";
import { parseCoverage } from "./coverage.ts";

const row = (id: string, status: string) => `| [authentication](../../product/features/authentication.md#acceptance-criteria) | **${id}** Text. | artifact | [01](phase-01.md) | backend | frontend | database | tests | ${status} |`;

describe("coverage matrix", () => {
  it("reads each row's criterion, status and line, ignoring other tables", () => {
    const markdown = [
      "| Specification | Acceptance criterion | Status |",
      row("AUTH-AC-001", "IN REVIEW"),
      row("AUTH-AC-008", "PARTIAL: the full journey closes later"),
      "| Identity proof | Authentication | AUTH-AC-005 | 01 | PLANNED |",
      row("SKL-AC-007", "OPEN QUESTION Q03"),
    ].join("\n");

    expect(parseCoverage(markdown)).toEqual({
      rows: [
        { id: "AUTH-AC-001", status: "IN REVIEW", line: 2 },
        { id: "AUTH-AC-008", status: "PARTIAL", line: 3 },
        { id: "SKL-AC-007", status: "OPEN QUESTION", line: 5 },
      ],
      errors: [],
    });
  });

  it("reports a status outside the vocabulary instead of guessing its meaning", () => {
    const { rows, errors } = parseCoverage(row("AUTH-AC-001", "DONE"));

    expect(rows).toEqual([]);
    expect(errors).toEqual([expect.stringContaining('COVERAGE.md:1: AUTH-AC-001 has status "DONE"')]);
  });
});
