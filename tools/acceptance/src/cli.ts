import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectPlaywrightTests, collectVitestTests } from "./collect.ts";
import { COVERAGE_PATH, EVIDENCE_STATUSES, parseCoverage } from "./coverage.ts";
import { loadCriteria } from "./criteria.ts";
import { checkEvidence, type TaggedTest } from "./evidence.ts";

const REPOSITORY = fileURLToPath(new URL("../../../", import.meta.url));

// The shared UI package is absent on purpose: its components satisfy no criterion on their own,
// and its Vitest config declares no tags, so its tests cannot cite one.
const SUITES = [
  { name: "api", runner: "vitest", directory: "api" },
  { name: "web", runner: "vitest", directory: "web" },
  { name: "web e2e", runner: "playwright", directory: "web" },
] as const;

const listTests = process.argv.includes("--list");

const criteria = loadCriteria();
const coverage = parseCoverage(readFileSync(COVERAGE_PATH, "utf8"));
const tests: TaggedTest[] = [];
for (const suite of SUITES) {
  const root = path.join(REPOSITORY, suite.directory);
  tests.push(...(suite.runner === "vitest" ? await collectVitestTests(suite.name, root, REPOSITORY) : await collectPlaywrightTests(suite.name, root, REPOSITORY)));
}
const report = checkEvidence({ criteria, coverage: coverage.rows, tests });
const errors = [...coverage.errors, ...report.errors];

for (const row of coverage.rows) {
  const cited = report.evidence.get(row.id) ?? [];
  if (!EVIDENCE_STATUSES.has(row.status) && cited.length === 0) continue;
  const bySuite = SUITES.map((suite) => [suite.name, cited.filter((test) => test.suite === suite.name).length] as const)
    .filter(([, count]) => count > 0)
    .map(([name, count]) => `${name} ${count}`)
    .join(", ");
  console.log(`${row.id.padEnd(12)} ${row.status.padEnd(10)} ${cited.length} test(s)${bySuite ? ` (${bySuite})` : ""}`);
  if (listTests) for (const test of cited) console.log(`    ${test.file} > ${test.name}`);
}
for (const notice of report.notices) console.log(`notice: ${notice}`);
for (const error of errors) console.error(`error: ${error}`);

const claimed = coverage.rows.filter((row) => EVIDENCE_STATUSES.has(row.status)).length;
const tagged = new Set([...report.evidence.values()].flat()).size;
console.log(`${criteria.length} criteria; ${claimed} claim executed evidence; ${tagged} of ${tests.length} tests cite a criterion.`);
if (errors.length > 0) process.exitCode = 1;
