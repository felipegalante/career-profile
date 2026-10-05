import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const apiDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export type TemporaryDatabasePurpose = "test" | "verify";
export type TemporaryDatabase = { url: string; drop(): Promise<void> };

export function requireDatabaseUrl(): URL {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("DATABASE_URL is required to create an isolated database.");

  const url = new URL(value);
  if ((url.protocol !== "postgres:" && url.protocol !== "postgresql:") || !url.pathname || url.pathname === "/") {
    throw new Error("DATABASE_URL must name a PostgreSQL database to create an isolated database.");
  }
  return url;
}

function databaseUrlFor(url: URL, databaseName: string): string {
  const result = new URL(url);
  result.pathname = `/${databaseName}`;
  return result.toString();
}

// Only names this module generates may reach CREATE/DROP DATABASE, which cannot be parameterized.
function databaseIdentifier(name: string): string {
  if (!/^career_profile_(?:test|verify)_[a-f0-9]+$/.test(name)) {
    throw new Error("Refusing to use an unsafe temporary database name.");
  }
  return `"${name}"`;
}

async function waitForDatabase(pool: pg.Pool): Promise<void> {
  for (let attempt = 0; attempt < 15; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1_000));
    }
  }

  throw new Error("Could not connect to the PostgreSQL server named by DATABASE_URL.");
}

/** Creates an empty database beside the configured one; `drop` removes it even with open connections. */
export async function createTemporaryDatabase(purpose: TemporaryDatabasePurpose): Promise<TemporaryDatabase> {
  const configuredUrl = requireDatabaseUrl();
  const name = `career_profile_${purpose}_${randomUUID().replaceAll("-", "")}`;
  const identifier = databaseIdentifier(name);
  const maintenancePool = new pg.Pool({ connectionString: databaseUrlFor(configuredUrl, "postgres") });

  try {
    await waitForDatabase(maintenancePool);
    await maintenancePool.query(`CREATE DATABASE ${identifier}`);
  } catch (error) {
    await maintenancePool.end();
    throw error;
  }

  return {
    url: databaseUrlFor(configuredUrl, name),
    drop: async () => {
      await maintenancePool.query(`DROP DATABASE IF EXISTS ${identifier} WITH (FORCE)`).catch(() => {});
      await maintenancePool.end();
    },
  };
}

/** Applies migrations through the same script operators run, rather than an in-process shortcut. */
export async function runMigration(databaseUrl: string): Promise<void> {
  await runProcess(process.execPath, ["--import", "tsx", "scripts/migrate.ts"], {
    ...process.env,
    DATABASE_URL: databaseUrl,
  });
}

async function runProcess(command: string, args: string[], environment: NodeJS.ProcessEnv): Promise<void> {
  const child = spawn(command, args, {
    cwd: apiDirectory,
    env: environment,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk) => {
    output += String(chunk);
  });
  child.stderr.on("data", (chunk) => {
    output += String(chunk);
  });
  const [exitCode] = (await once(child, "exit")) as [number | null];
  if (exitCode !== 0) {
    throw new Error(`Database subprocess failed (${command} ${args.join(" ")}): ${safeOutput(output)}`);
  }
}

export function safeOutput(value: string): string {
  return value
    .replaceAll(/postgres(?:ql)?:\/\/[^\s]+/gi, "[REDACTED_DATABASE_URL]")
    .replaceAll(/password=[^\s]+/gi, "password=[REDACTED]")
    .trim()
    .slice(0, 2_000);
}
