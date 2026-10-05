import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { createVitest } from "vitest/node";
import type { TaggedTest } from "./evidence.ts";

const execFileAsync = promisify(execFile);

/**
 * Lists a Vitest project's tests with their tags by parsing test files statically, so no test
 * file runs and no global setup (such as a test database) starts.
 */
export async function collectVitestTests(suite: string, root: string, repository: string): Promise<TaggedTest[]> {
  const vitest = await createVitest("test", { root, watch: false, reporters: [] });
  try {
    const { testModules, unhandledErrors } = await vitest.collect(undefined, { staticParse: true });
    const moduleErrors = testModules.flatMap((module) => module.errors());
    if (unhandledErrors.length || moduleErrors.length) {
      throw new Error(`Could not list the ${suite} tests: ${[...unhandledErrors, ...moduleErrors].map((error) => String((error as { message?: unknown }).message ?? error)).join("; ")}`);
    }
    return testModules.flatMap((module) =>
      [...module.children.allTests()].map((test) => ({ suite, file: path.relative(repository, test.module.moduleId), name: test.fullName, tags: [...test.tags] }))
    );
  } finally {
    await vitest.close();
  }
}

type PlaywrightSuite = { title: string; file?: string; specs?: Array<{ title: string; file: string; tags?: string[] }>; suites?: PlaywrightSuite[] };
type PlaywrightListing = { config: { rootDir: string }; suites: PlaywrightSuite[]; errors?: Array<{ message?: string }> };

/** Lists Playwright tests with their tags without starting the configured web servers. */
export async function collectPlaywrightTests(suite: string, root: string, repository: string): Promise<TaggedTest[]> {
  const { stdout } = await execFileAsync(path.join(root, "node_modules/.bin/playwright"), ["test", "--list", "--reporter=json"], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
  const listing = JSON.parse(stdout) as PlaywrightListing;
  if (listing.errors?.length) throw new Error(`Could not list the ${suite} tests: ${listing.errors.map((error) => error.message).join("; ")}`);

  const tests: TaggedTest[] = [];
  const visit = (node: PlaywrightSuite, titles: string[]) => {
    for (const spec of node.specs ?? []) {
      // The JSON reporter drops the leading @ that tags carry in test files.
      const tags = (spec.tags ?? []).map((tag) => (tag.startsWith("@") ? tag : `@${tag}`));
      tests.push({ suite, file: path.relative(repository, path.join(listing.config.rootDir, spec.file)), name: [...titles, spec.title].join(" > "), tags });
    }
    for (const child of node.suites ?? []) visit(child, [...titles, child.title]);
  };
  // Top-level suites are files; their titles are file names, not describe blocks.
  for (const file of listing.suites) visit(file, []);
  return tests;
}
