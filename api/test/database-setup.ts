import type { TestProject } from "vitest/node";
import { createTemporaryDatabase, runMigration } from "../scripts/temporary-database.js";
import { loadEnvironmentFile } from "../src/config.js";

declare module "vitest" {
  export interface ProvidedContext {
    /** A freshly migrated database owned by this test run, or null when no server is configured. */
    databaseUrl: string | null;
  }
}

export default async function setup(project: TestProject): Promise<(() => Promise<void>) | undefined> {
  loadEnvironmentFile();
  if (!process.env.DATABASE_URL) {
    // A CI job without a database would otherwise report the skipped suites as a pass.
    if (process.env.CI) throw new Error("DATABASE_URL is required for database tests in CI.");
    project.provide("databaseUrl", null);
    return undefined;
  }

  const database = await createTemporaryDatabase("test");
  try {
    await runMigration(database.url);
  } catch (error) {
    await database.drop();
    throw error;
  }
  project.provide("databaseUrl", database.url);
  return () => database.drop();
}
