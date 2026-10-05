import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { criterionTags, loadCriteria, parseCriteria } from "./criteria.ts";

describe("acceptance criteria", () => {
  const directories: string[] = [];

  afterEach(() => {
    for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
  });

  function specifications(files: Record<string, string>): string {
    const directory = mkdtempSync(path.join(tmpdir(), "acceptance-criteria-"));
    directories.push(directory);
    for (const [name, content] of Object.entries(files)) writeFileSync(path.join(directory, name), content);
    return directory;
  }

  it("reads criterion lines and ignores mentions of criteria elsewhere in a spec", () => {
    const markdown = [
      "Covers AUTH-AC-001 in prose.",
      "- **AUTH-AC-001:** Public registration validates email.",
      "  - **AUTH-AC-002:** Every password input has a show/hide control.  ",
      "- **AUTH-AC-3:** Malformed identifiers are not criteria.",
    ].join("\n");

    expect(parseCriteria(markdown, "authentication")).toEqual([
      { id: "AUTH-AC-001", feature: "authentication", text: "Public registration validates email." },
      { id: "AUTH-AC-002", feature: "authentication", text: "Every password input has a show/hide control." },
    ]);
  });

  it("loads every specification except the template and the index", () => {
    const directory = specifications({
      "authentication.md": "- **AUTH-AC-001:** Registration.",
      "skills.md": "- **SKL-AC-001:** Skills lanes.",
      "TEMPLATE.md": "- **XXX-AC-001:** Placeholder.",
      "README.md": "- **IDX-AC-001:** Not a specification.",
    });

    expect(loadCriteria(directory).map((criterion) => criterion.id)).toEqual(["AUTH-AC-001", "SKL-AC-001"]);
  });

  it("rejects an ID defined by two specifications", () => {
    const directory = specifications({
      "authentication.md": "- **AUTH-AC-001:** Registration.",
      "onboarding.md": "- **AUTH-AC-001:** Copied by mistake.",
    });

    expect(() => loadCriteria(directory)).toThrow("AUTH-AC-001 is defined in both authentication.md and onboarding.md");
  });

  it("declares one @-prefixed tag per criterion, described by its text", () => {
    const directory = specifications({ "authentication.md": "- **AUTH-AC-007:** Logout invalidates the active session." });

    expect(criterionTags(directory)).toEqual([{ name: "@AUTH-AC-007", description: "Logout invalidates the active session." }]);
  });
});
