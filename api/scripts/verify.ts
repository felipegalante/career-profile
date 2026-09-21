import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";
import { validateSeeds } from "./validate-seeds.js";

const apiDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function requireDatabaseUrl(): URL {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("DATABASE_URL is required for isolated verification.");

  const url = new URL(value);
  if ((url.protocol !== "postgres:" && url.protocol !== "postgresql:") || !url.pathname || url.pathname === "/") {
    throw new Error("DATABASE_URL must name a PostgreSQL database for isolated verification.");
  }
  return url;
}

function temporaryDatabaseName(): string {
  return `career_profile_verify_${randomUUID().replaceAll("-", "")}`;
}

function databaseUrlFor(url: URL, databaseName: string): string {
  const result = new URL(url);
  result.pathname = `/${databaseName}`;
  return result.toString();
}

function databaseIdentifier(name: string): string {
  if (!/^career_profile_verify_[a-f0-9]+$/.test(name)) {
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

  throw new Error("Could not connect to the PostgreSQL server for isolated verification.");
}

async function runMigration(databaseUrl: string): Promise<void> {
  await runProcess(process.execPath, ["--import", "tsx", "scripts/migrate.ts"], {
    ...process.env,
    DATABASE_URL: databaseUrl,
  });
}

async function verifyLegacyMigrationTransition(databaseUrl: string): Promise<void> {
  const pool = new pg.Pool({ connectionString: databaseUrl });
  try {
    await pool.query("CREATE TABLE public.schema_migrations (name text PRIMARY KEY)");
    await pool.query("INSERT INTO public.schema_migrations (name) VALUES ($1)", ["001_init.sql"]);
  } finally {
    await pool.end();
  }

  await runMigration(databaseUrl);

  const verificationPool = new pg.Pool({ connectionString: databaseUrl });
  try {
    const result = await verificationPool.query<{ exists: string | null }>(
      "SELECT to_regclass('public.schema_migrations') AS exists"
    );
    if (result.rows[0]?.exists !== null) {
      throw new Error("Legacy migration history was not retired.");
    }
  } finally {
    await verificationPool.end();
  }
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
    throw new Error(`Verification subprocess failed (${command} ${args.join(" ")}): ${safeOutput(output)}`);
  }
}

async function startApi(databaseUrl: string, instanceId: string): Promise<{ child: ReturnType<typeof spawn>; port: number }> {
  const serverPath = path.resolve(apiDirectory, "dist/server.js");
  if (!existsSync(serverPath)) {
    throw new Error("API build output is missing. Run pnpm build before pnpm verify.");
  }

  const child = spawn(process.execPath, [serverPath], {
    cwd: apiDirectory,
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      HOST: "127.0.0.1",
      NODE_ENV: "test",
      PORT: "0",
      VERIFY_INSTANCE_ID: instanceId,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const port = await waitForListeningPort(child);
  return { child, port };
}

async function waitForListeningPort(child: ReturnType<typeof spawn>): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const stdout = child.stdout;
    const stderr = child.stderr;
    if (!stdout || !stderr) {
      reject(new Error("Verification API did not expose output streams."));
      return;
    }
    let output = "";
    const timeout = setTimeout(() => reject(new Error("Timed out waiting for the verification API to start.")), 10_000);
    const finish = (callback: () => void) => {
      clearTimeout(timeout);
      stdout.removeAllListeners("data");
      stderr.removeAllListeners("data");
      child.removeAllListeners("exit");
      callback();
    };
    const inspect = (chunk: Buffer) => {
      output += chunk.toString();
      for (const line of output.split("\n")) {
        try {
          const event = JSON.parse(line) as { event?: unknown; port?: unknown };
          if (event.event === "api-listening" && typeof event.port === "number") {
            const port = event.port;
            finish(() => resolve(port));
            return;
          }
        } catch {
          // Wait for the structured readiness line; log output is not a failure by itself.
        }
      }
    };
    stdout.on("data", inspect);
    stderr.on("data", inspect);
    child.once("exit", (code) => finish(() => reject(new Error(`Verification API exited early (${code}): ${safeOutput(output)}`))));
  });
}

async function stopApi(child: ReturnType<typeof spawn>): Promise<void> {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    once(child, "exit"),
    new Promise<void>((resolve) => setTimeout(resolve, 5_000)),
  ]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

async function smokeApi(port: number, instanceId: string): Promise<void> {
  const readiness = await fetch(`http://127.0.0.1:${port}/readyz`);
  const readinessPayload = (await readiness.json()) as { instanceId?: unknown; status?: unknown };
  if (!readiness.ok || readinessPayload.status !== "ok" || readinessPayload.instanceId !== instanceId) {
    throw new Error("Verification API readiness did not identify its owned instance.");
  }

  const graphql = await fetch(`http://127.0.0.1:${port}/graphql`, {
    body: JSON.stringify({ query: "{ ping }" }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  const graphqlPayload = (await graphql.json()) as { data?: { ping?: unknown } };
  if (!graphql.ok || graphqlPayload.data?.ping !== "pong") {
    throw new Error("Verification API GraphQL smoke request failed.");
  }
}

function safeOutput(value: string): string {
  return value
    .replaceAll(/postgres(?:ql)?:\/\/[^\s]+/gi, "[REDACTED_DATABASE_URL]")
    .replaceAll(/password=[^\s]+/gi, "password=[REDACTED]")
    .trim()
    .slice(0, 2_000);
}

async function verify(): Promise<void> {
  const configuredUrl = requireDatabaseUrl();
  const temporaryName = temporaryDatabaseName();
  const temporaryUrl = databaseUrlFor(configuredUrl, temporaryName);
  const maintenanceUrl = databaseUrlFor(configuredUrl, "postgres");
  const maintenancePool = new pg.Pool({ connectionString: maintenanceUrl });
  let api: ReturnType<typeof spawn> | undefined;

  try {
    await waitForDatabase(maintenancePool);
    await maintenancePool.query(`CREATE DATABASE ${databaseIdentifier(temporaryName)}`);
    await runMigration(temporaryUrl);
    await runMigration(temporaryUrl);
    await verifyLegacyMigrationTransition(temporaryUrl);
    await validateSeeds();

    const instanceId = randomUUID();
    const started = await startApi(temporaryUrl, instanceId);
    api = started.child;
    await smokeApi(started.port, instanceId);
    console.log("Isolated verification passed.");
  } finally {
    if (api) await stopApi(api);
    await maintenancePool.query(`DROP DATABASE IF EXISTS ${databaseIdentifier(temporaryName)} WITH (FORCE)`).catch(() => {});
    await maintenancePool.end();
  }
}

try {
  await verify();
} catch (error) {
  console.error(`Verification failed: ${safeOutput(error instanceof Error ? error.message : String(error))}`);
  process.exitCode = 1;
}
