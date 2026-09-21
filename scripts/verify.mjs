// Environment check: database reachable -> migrations apply -> API boots and
// sees the database -> workspace tests pass. Green means you're ready.
import { spawn, spawnSync } from "node:child_process";
import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://profile_app:profile_app@localhost:5433/career_profile";
const apiPort = Number(process.env.PORT ?? 3001);
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const isWin = process.platform === "win32";

function fail(message) {
  console.error(`\n❌ ${message}`);
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function killTree(child) {
  if (!child || child.exitCode !== null) return;
  if (isWin) {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      child.kill("SIGTERM");
    }
  }
}

// 1. Database reachable
console.log("1/4 Checking the database is reachable...");
{
  let connected = false;
  for (let attempt = 0; attempt < 15 && !connected; attempt++) {
    const client = new pg.Client({ connectionString });
    try {
      await client.connect();
      await client.query("SELECT 1");
      connected = true;
    } catch {
      await sleep(2000);
    } finally {
      await client.end().catch(() => {});
    }
  }
  if (!connected) {
    fail(
      `Could not reach Postgres at ${connectionString}.\n` +
        "   Is the database running? Try: docker compose up -d\n" +
        "   (or set DATABASE_URL to point at your own Postgres)"
    );
  }
  console.log("    ok");
}

// 2. Migrations
console.log("2/4 Applying migrations...");
{
  const result = spawnSync(process.execPath, ["scripts/migrate.mjs"], { stdio: "inherit" });
  if (result.status !== 0) fail("Migrations failed.");
}

// 3. API boots and can see the database
console.log("3/4 Booting the API and checking /healthz...");
const api = spawn(pnpm, ["--filter", "api", "start"], {
  stdio: "ignore",
  detached: !isWin,
});
try {
  let healthy = false;
  let lastSeen = "(no response)";
  for (let attempt = 0; attempt < 30 && !healthy; attempt++) {
    await sleep(1000);
    try {
      const res = await fetch(`http://localhost:${apiPort}/healthz`);
      const body = await res.json();
      lastSeen = JSON.stringify(body);
      healthy = body.api === "ok" && body.db === "ok";
    } catch {
      // API not up yet; keep waiting.
    }
  }
  if (!healthy) fail(`API health check did not go green. Last response: ${lastSeen}`);
  console.log("    ok");
} finally {
  killTree(api);
}

// 4. Tests
console.log("4/4 Running tests...");
{
  const result = spawnSync(pnpm, ["test"], { stdio: "inherit" });
  if (result.status !== 0) fail("Tests failed.");
}

console.log("\n✅ Environment ready.");
