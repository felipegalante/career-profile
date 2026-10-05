// The package entry point. Other packages type-check it with their own compiler options and load it
// through Node's type stripping, so it imports only Node built-ins.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type AcceptanceCriterion = { id: string; feature: string; text: string };

export const FEATURES_DIRECTORY = fileURLToPath(new URL("../../../docs/product/features/", import.meta.url));

/** A criterion ID as feature specs write it, such as `AUTH-AC-001`. */
export const CRITERION_ID = /^[A-Z]+-AC-\d{3}$/;

// Feature specs list each criterion as `- **AUTH-AC-001:** text`.
const CRITERION_LINE = /^- \*\*([A-Z]+-AC-\d{3}):\*\* (.+)$/;

// TEMPLATE.md holds a placeholder criterion; README.md indexes the specs.
const NON_SPECIFICATIONS = new Set(["README.md", "TEMPLATE.md"]);

export function parseCriteria(markdown: string, feature: string): AcceptanceCriterion[] {
  return markdown.split("\n").flatMap((line) => {
    const match = CRITERION_LINE.exec(line.trim());
    return match ? [{ id: match[1]!, feature, text: match[2]!.trim() }] : [];
  });
}

/** Every acceptance criterion in the feature specs, in file order. */
export function loadCriteria(directory = FEATURES_DIRECTORY): AcceptanceCriterion[] {
  const criteria = readdirSync(directory)
    .filter((name) => name.endsWith(".md") && !NON_SPECIFICATIONS.has(name))
    .sort()
    .flatMap((name) => parseCriteria(readFileSync(path.join(directory, name), "utf8"), name.slice(0, -".md".length)));

  const features = new Map<string, string>();
  for (const criterion of criteria) {
    const earlier = features.get(criterion.id);
    if (earlier) throw new Error(`Acceptance criterion ${criterion.id} is defined in both ${earlier}.md and ${criterion.feature}.md.`);
    features.set(criterion.id, criterion.feature);
  }
  return criteria;
}

export function criterionTag(id: string): string {
  return `@${id}`;
}

/**
 * One tag per criterion, for runners that reject undeclared tags: a test can then cite only a
 * criterion that exists in the specs, and renaming or removing a criterion fails its tests.
 */
export function criterionTags(directory?: string): Array<{ name: string; description: string }> {
  return loadCriteria(directory).map((criterion) => ({ name: criterionTag(criterion.id), description: criterion.text }));
}
