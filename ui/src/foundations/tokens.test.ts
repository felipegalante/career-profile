import { describe, expect, it } from "vitest";
import artifactStyles from "../../../docs/design/artifacts/assets/styles.css?raw";
import tokenStyles from "./tokens.css?raw";

function rootTokens(css: string): Map<string, string> {
  const block = css.replace(/\/\*[\s\S]*?\*\//g, "").match(/:root\s*\{([\s\S]*?)\}/);
  if (!block) throw new Error("No :root block found");
  const tokens = new Map<string, string>();
  for (const declaration of block[1].split(";")) {
    const separator = declaration.indexOf(":");
    if (separator === -1) continue;
    const name = declaration.slice(0, separator).trim();
    const value = declaration.slice(separator + 1).replace(/\s+/g, " ").replace(/\s*([,/])\s*/g, "$1").trim();
    if (name.startsWith("--")) tokens.set(name, value);
  }
  return tokens;
}

describe("design tokens", () => {
  const artifact = rootTokens(artifactStyles);
  const library = rootTokens(tokenStyles);

  it("reproduces every artifact token except the documented accessibility adjustment", () => {
    for (const [name, value] of artifact) {
      if (name === "--ink-3") continue;
      expect(library.get(name), name).toBe(value);
    }
  });

  it("darkens faint text so it meets WCAG AA contrast on tinted surfaces", () => {
    expect(artifact.get("--ink-3")).toBe("oklch(0.54 0.014 262)");
    expect(library.get("--ink-3")).toBe("oklch(0.51 0.014 262)");
  });

  it("defines the brand line referenced by the artifact drag styles and nothing else extra", () => {
    const extra = [...library.keys()].filter((name) => !artifact.has(name));
    expect(extra).toEqual(["--brand-line"]);
    expect(artifactStyles).toContain("var(--brand-line)");
  });
});
