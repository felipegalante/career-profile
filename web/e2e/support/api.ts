import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

/*
 * Browser tests own their web and API ports, so a developer's running `pnpm dev` (and the database
 * behind it) is never reused for a journey that expects the browser-test database.
 */
export const E2E_WEB_ORIGIN = "http://localhost:5310";
export const E2E_API_PORT = 5311;

/** The server and the fixture command must hash setup proofs with the same secret. */
export const E2E_API_ENV = {
  APP_ORIGIN: E2E_WEB_ORIGIN,
  HOST: "127.0.0.1",
  PORT: String(E2E_API_PORT),
  SESSION_SECRET: "browser-test-session-secret",
};

const apiDirectory = fileURLToPath(new URL("../../../api", import.meta.url));

export type SetupFixture = { email: string; proof: string };

/** Creates an account awaiting a password in the browser-test database and returns its one-use proof. */
export function createSetupFixture(kind: "first-password" | "reset"): SetupFixture {
  const output = execFileSync(process.execPath, ["--import", "tsx", "test/e2e-fixture.ts", kind], {
    cwd: apiDirectory,
    encoding: "utf8",
    env: { ...process.env, ...E2E_API_ENV },
  });
  return JSON.parse(output.trim().split("\n").at(-1)!) as SetupFixture;
}
