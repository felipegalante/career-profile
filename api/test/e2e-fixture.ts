import { browserTestDatabaseUrl } from "../scripts/temporary-database.js";
import { AuthService } from "../src/auth/service.js";
import { loadEnvironmentFile, parseRuntimeConfig } from "../src/config.js";
import { createDatabase } from "../src/db.js";
import { insertSetupRequiredUser } from "./auth-api.js";

/*
 * Prints `{"email","proof"}` for an account awaiting a password in the browser-test database:
 * `first-password` is a new account that has not onboarded, `reset` is an onboarded account
 * whose credentials were reset. The proof is hashed with the same secret the server reads.
 */
const kind = process.argv[2];
if (kind !== "first-password" && kind !== "reset") throw new Error("Usage: e2e-fixture.ts first-password|reset");

loadEnvironmentFile();
const config = parseRuntimeConfig({ ...process.env, DATABASE_URL: browserTestDatabaseUrl() });
const database = createDatabase(config.databaseUrl);
try {
  const auth = new AuthService(database, config.sessionSecret);
  const account = await insertSetupRequiredUser(database, { onboardingCompleted: kind === "reset" });
  const proof = kind === "reset" ? await auth.requirePasswordSetup(account.id, "RESET") : await auth.issueSetupGrant(account.id, "FIRST_PASSWORD");
  console.log(JSON.stringify({ email: account.email, proof }));
} finally {
  await database.close();
}
