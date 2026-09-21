import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type SeedRow = Record<string, unknown>;

const seedsDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../../db/seeds");

async function readSeedArray(filename: string): Promise<SeedRow[]> {
  const parsed = JSON.parse(await readFile(resolve(seedsDirectory, filename), "utf8")) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`${filename} must contain a JSON array.`);
  }
  return parsed.map((row, index) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      throw new Error(`${filename} row ${index + 1} must be an object.`);
    }
    return row as SeedRow;
  });
}

function seedKeySet(filename: string, rows: SeedRow[], labelField: string): Set<string> {
  const keys = new Set<string>();
  for (const [index, row] of rows.entries()) {
    const seedKey = row.seedKey;
    const label = row[labelField];
    if (typeof seedKey !== "string" || !seedKey || typeof label !== "string" || !label.trim()) {
      throw new Error(`${filename} row ${index + 1} requires a non-empty seedKey and ${labelField}.`);
    }
    if (keys.has(seedKey)) {
      throw new Error(`${filename} repeats seedKey ${seedKey}.`);
    }
    keys.add(seedKey);
  }
  return keys;
}

function requireReference(filename: string, field: string, value: unknown, keys: Set<string>): void {
  if (typeof value !== "string" || !keys.has(value)) {
    throw new Error(`${filename} references an unknown ${field}.`);
  }
}

function validateRelationRows(
  filename: string,
  rows: SeedRow[],
  references: Record<string, Set<string>>
): void {
  for (const row of rows) {
    for (const [field, keys] of Object.entries(references)) {
      requireReference(filename, field, row[field], keys);
    }
  }
}

async function validateSkillsCsv(): Promise<void> {
  const [header, ...rows] = (await readFile(resolve(seedsDirectory, "global-skills.csv"), "utf8"))
    .trim()
    .split(/\r?\n/);
  if (header !== "seed_key,label,category") {
    throw new Error("global-skills.csv has an unexpected header.");
  }

  const keys = new Set<string>();
  for (const [index, row] of rows.entries()) {
    const columns = row.split(",");
    if (columns.length !== 3 || !columns[0] || !columns[1] || !["TECHNICAL", "FOUNDATIONAL"].includes(columns[2])) {
      throw new Error(`global-skills.csv row ${index + 2} is invalid.`);
    }
    if (keys.has(columns[0])) {
      throw new Error(`global-skills.csv repeats seed_key ${columns[0]}.`);
    }
    keys.add(columns[0]);
  }
}

export async function validateSeeds(): Promise<void> {
  const [companies, jobTitles, institutions, majors, degrees, boards, certifications, focusAreas, users] = await Promise.all([
    readSeedArray("companies.seed.json"),
    readSeedArray("job-titles.seed.json"),
    readSeedArray("institutions.seed.json"),
    readSeedArray("majors-specializations.seed.json"),
    readSeedArray("degree-types.seed.json"),
    readSeedArray("certification-boards.seed.json"),
    readSeedArray("certifications.seed.json"),
    readSeedArray("focus-areas.seed.json"),
    readSeedArray("users.seed.json"),
  ]);
  const companyKeys = seedKeySet("companies.seed.json", companies, "name");
  const jobTitleKeys = seedKeySet("job-titles.seed.json", jobTitles, "label");
  const institutionKeys = seedKeySet("institutions.seed.json", institutions, "name");
  const majorKeys = seedKeySet("majors-specializations.seed.json", majors, "label");
  const degreeKeys = seedKeySet("degree-types.seed.json", degrees, "label");
  const boardKeys = seedKeySet("certification-boards.seed.json", boards, "name");
  seedKeySet("certifications.seed.json", certifications, "name");
  const focusAreaKeys = seedKeySet("focus-areas.seed.json", focusAreas, "label");
  seedKeySet("users.seed.json", users, "email");

  await Promise.all([
    validateSkillsCsv(),
    readSeedArray("company-job-titles.seed.json").then((rows) =>
      validateRelationRows("company-job-titles.seed.json", rows, {
        companySeedKey: companyKeys,
        jobTitleSeedKey: jobTitleKeys,
      })
    ),
    readSeedArray("institution-programs.seed.json").then((rows) =>
      validateRelationRows("institution-programs.seed.json", rows, {
        degreeTypeSeedKey: degreeKeys,
        institutionSeedKey: institutionKeys,
        majorSeedKey: majorKeys,
      })
    ),
    Promise.resolve(validateRelationRows("certifications.seed.json", certifications, { boardSeedKey: boardKeys })),
    validateProfileFixtures({ boardKeys, companyKeys, degreeKeys, focusAreaKeys, institutionKeys, jobTitleKeys, majorKeys }),
  ]);
}

async function validateProfileFixtures(references: Record<string, Set<string>>): Promise<void> {
  const fixtures = JSON.parse(await readFile(resolve(seedsDirectory, "profile-fixtures.seed.json"), "utf8")) as Record<
    string,
    SeedRow
  >;
  for (const fixture of Object.values(fixtures)) {
    const focusKeys = fixture.professionalFocusSeedKeys;
    if (Array.isArray(focusKeys)) {
      for (const key of focusKeys) requireReference("profile-fixtures.seed.json", "professionalFocusSeedKeys", key, references.focusAreaKeys);
    }
    if (fixture.primaryFocusSeedKey !== undefined) {
      requireReference("profile-fixtures.seed.json", "primaryFocusSeedKey", fixture.primaryFocusSeedKey, references.focusAreaKeys);
    }
    for (const work of asRows(fixture.workExperiences)) {
      requireReference("profile-fixtures.seed.json", "companySeedKey", work.companySeedKey, references.companyKeys);
      requireReference("profile-fixtures.seed.json", "jobTitleSeedKey", work.jobTitleSeedKey, references.jobTitleKeys);
    }
    for (const education of asRows(fixture.education)) {
      requireReference("profile-fixtures.seed.json", "institutionSeedKey", education.institutionSeedKey, references.institutionKeys);
      requireReference("profile-fixtures.seed.json", "majorSeedKey", education.majorSeedKey, references.majorKeys);
      requireReference("profile-fixtures.seed.json", "degreeTypeSeedKey", education.degreeTypeSeedKey, references.degreeKeys);
    }
    for (const certification of asRows(fixture.certifications)) {
      requireReference("profile-fixtures.seed.json", "boardSeedKey", certification.boardSeedKey, references.boardKeys);
    }
  }
}

function asRows(value: unknown): SeedRow[] {
  return Array.isArray(value) ? value.filter((row): row is SeedRow => !!row && typeof row === "object" && !Array.isArray(row)) : [];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await validateSeeds();
  console.log("Seed sources are structurally valid.");
}
