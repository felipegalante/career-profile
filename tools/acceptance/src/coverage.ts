import { fileURLToPath } from "node:url";

export const COVERAGE_PATH = fileURLToPath(new URL("../../../docs/engineering/implementation/COVERAGE.md", import.meta.url));

export const COVERAGE_STATUSES = ["PLANNED", "OPEN QUESTION", "PARTIAL", "IN REVIEW", "ACCEPTED"] as const;
export type CoverageStatus = (typeof COVERAGE_STATUSES)[number];

/** Statuses that assert tests already exercise the criterion, so at least one tagged test must exist. */
export const EVIDENCE_STATUSES: ReadonlySet<CoverageStatus> = new Set<CoverageStatus>(["PARTIAL", "IN REVIEW", "ACCEPTED"]);

export type CoverageRow = { id: string; status: CoverageStatus; line: number };

// Matrix rows start with the owning spec link and name their criterion as `**AUTH-AC-001**`.
const MATRIX_ROW = /^\| \[[^\]]+\]\([^)]+\) \| \*\*([A-Z]+-AC-\d{3})\*\*/;
const STATUS = new RegExp(`^(${COVERAGE_STATUSES.join("|")})\\b`);

/** Reads each matrix row's criterion and the status that opens its last cell. */
export function parseCoverage(markdown: string): { rows: CoverageRow[]; errors: string[] } {
  const rows: CoverageRow[] = [];
  const errors: string[] = [];
  markdown.split("\n").forEach((text, index) => {
    const row = MATRIX_ROW.exec(text);
    if (!row) return;
    const line = index + 1;
    const statusCell = text.slice(text.lastIndexOf(" | ") + 3).replace(/\s*\|\s*$/, "");
    const status = STATUS.exec(statusCell)?.[1] as CoverageStatus | undefined;
    if (status) rows.push({ id: row[1]!, status, line });
    else errors.push(`COVERAGE.md:${line}: ${row[1]} has status "${statusCell}", which does not start with ${COVERAGE_STATUSES.join(", ")}.`);
  });
  return { rows, errors };
}
