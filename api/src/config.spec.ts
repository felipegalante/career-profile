import { describe, expect, it } from "vitest";
import { parseRuntimeConfig } from "./config.js";

describe("runtime configuration", () => {
  it("requires a PostgreSQL database URL", () => {
    expect(() => parseRuntimeConfig({})).toThrow("DATABASE_URL is required.");
    expect(() => parseRuntimeConfig({ DATABASE_URL: "https://example.test" })).toThrow(
      "DATABASE_URL must use the postgres protocol."
    );
  });

  it("rejects malformed runtime values", () => {
    expect(() => parseRuntimeConfig({ DATABASE_URL: "postgres://localhost/app", PORT: "not-a-port" })).toThrow(
      "PORT must be an integer"
    );
    expect(() => parseRuntimeConfig({ DATABASE_URL: "postgres://localhost/app", NODE_ENV: "staging" })).toThrow(
      "NODE_ENV must be development, test, or production."
    );
    expect(() => parseRuntimeConfig({ DATABASE_URL: "postgres://localhost/app", TRUST_PROXY: "sometimes" })).toThrow(
      "TRUST_PROXY must be true or false."
    );
  });

  it("uses forwarded client addresses only when explicitly configured", () => {
    expect(parseRuntimeConfig({ DATABASE_URL: "postgres://localhost/app" }).trustProxy).toBe(false);
    expect(parseRuntimeConfig({ DATABASE_URL: "postgres://localhost/app", TRUST_PROXY: "true" }).trustProxy).toBe(true);
  });
});
