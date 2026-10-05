import { recreateBrowserTestDatabase, runMigration } from "../scripts/temporary-database.js";
import { loadEnvironmentFile } from "../src/config.js";

// Browser journeys run the real server entry against a database recreated for each run, so
// accounts and throttle windows from earlier runs never reach a journey.
loadEnvironmentFile();
const databaseUrl = await recreateBrowserTestDatabase();
await runMigration(databaseUrl);
process.env.DATABASE_URL = databaseUrl;
await import("../src/server.js");
