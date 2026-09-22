import { describe, expect, it } from "vitest";
import { normalizeEmail, validatePassword } from "./service.js";

describe("authentication input policy", () => {
  it("normalizes Unicode whitespace/casing without provider rewrites", () => {
    expect(normalizeEmail("  Alex+Work@Example.TEST  ")).toBe("alex+work@example.test");
  });

  it("requires a bounded mixed-class password", () => {
    expect(() => validatePassword("short")).toThrow(/10–128/);
    expect(() => validatePassword("longenoughbutnoclass1")).toThrow(/10–128/);
    expect(() => validatePassword("ValidPassword!1")).not.toThrow();
  });
});
