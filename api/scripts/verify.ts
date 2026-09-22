import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";
import { AuthError } from "../src/auth/errors.js";
import { AuthService } from "../src/auth/service.js";
import { loadEnvironmentFile } from "../src/config.js";
import { createDatabase } from "../src/db.js";
import { users } from "../src/db/schema.js";
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

export async function startApi(databaseUrl: string, instanceId: string): Promise<{ child: ReturnType<typeof spawn>; port: number }> {
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
  return waitForApiStart(child);
}

export async function waitForApiStart(
  child: ReturnType<typeof spawn>,
  timeoutMs = 10_000
): Promise<{ child: ReturnType<typeof spawn>; port: number }> {
  try {
    const port = await waitForListeningPort(child, timeoutMs);
    return { child, port };
  } catch (error) {
    await stopApi(child);
    throw error;
  }
}

export async function waitForListeningPort(child: ReturnType<typeof spawn>, timeoutMs = 10_000): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const stdout = child.stdout;
    const stderr = child.stderr;
    if (!stdout || !stderr) {
      reject(new Error("Verification API did not expose output streams."));
      return;
    }
    let output = "";
    let settled = false;
    let timeout: NodeJS.Timeout | undefined;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      stdout.off("data", inspect);
      stderr.off("data", inspect);
      child.off("exit", onExit);
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
    const onExit = (code: number | null) => {
      finish(() => reject(new Error(`Verification API exited early (${code}): ${safeOutput(output)}`)));
    };
    stdout.on("data", inspect);
    stderr.on("data", inspect);
    child.once("exit", onExit);
    timeout = setTimeout(() => {
      finish(() => reject(new Error("Timed out waiting for the verification API to start.")));
    }, timeoutMs);
  });
}

function hasExited(child: ReturnType<typeof spawn>): boolean {
  return child.exitCode !== null || child.signalCode !== null;
}

async function waitForApiExit(child: ReturnType<typeof spawn>, timeoutMs: number): Promise<boolean> {
  if (hasExited(child)) return true;

  return new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (exited: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      child.off("exit", onExit);
      resolve(exited);
    };
    const onExit = () => finish(true);
    const timeout = setTimeout(() => finish(false), timeoutMs);
    child.once("exit", onExit);
  });
}

export async function stopApi(child: ReturnType<typeof spawn>): Promise<void> {
  if (hasExited(child)) return;
  const terminated = waitForApiExit(child, 5_000);
  child.kill("SIGTERM");
  if (await terminated) return;

  const killed = waitForApiExit(child, 5_000);
  child.kill("SIGKILL");
  if (!(await killed)) {
    throw new Error("Could not stop the verification API.");
  }
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

  await smokeAuthenticationApi(port);
}

type GraphqlPayload = { data?: Record<string, unknown>; errors?: Array<{ extensions?: { code?: unknown }; message?: unknown }> };

function cookiesFrom(response: Response): string {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] };
  const cookies = headers.getSetCookie?.() ?? [];
  return cookies.map((cookie) => cookie.split(";", 1)[0]).join("; ");
}

function cookieValue(cookies: string, name: string): string | undefined {
  return cookies.split("; ").find((cookie) => cookie.startsWith(`${name}=`))?.slice(name.length + 1);
}

async function authRequest(port: number, query: string, variables?: Record<string, unknown>, cookie?: string, csrf?: string): Promise<{ response: Response; payload: GraphqlPayload }> {
  const response = await fetch(`http://127.0.0.1:${port}/graphql`, {
    body: JSON.stringify({ query, variables }),
    headers: {
      "content-type": "application/json",
      origin: "http://localhost:5173",
      "x-csrf-request": "1",
      ...(cookie ? { cookie } : {}),
      ...(csrf ? { "x-csrf-token": decodeURIComponent(csrf) } : {}),
    },
    method: "POST",
  });
  return { response, payload: await response.json() as GraphqlPayload };
}

async function smokeAuthenticationApi(port: number): Promise<void> {
  const credentials = { email: "verify-auth@careerprofile.test", password: "ValidPassword!1" };
  const register = await authRequest(port, "mutation Register($input: CredentialsInput!) { register(input: $input) { viewer { email } } }", { input: credentials });
  const cookies = cookiesFrom(register.response);
  const csrfCookieName = register.response.headers.get("x-csrf-cookie-name");
  const csrf = csrfCookieName ? cookieValue(cookies, csrfCookieName) : undefined;
  if (register.payload.data?.register === undefined || !cookies || !csrf || csrfCookieName !== "career_profile_session_csrf") {
    throw new Error("Authentication registration did not establish the expected session and CSRF cookies.");
  }

  const viewer = await authRequest(port, "query Viewer { viewer { email } }", undefined, cookies);
  if ((viewer.payload.data?.viewer as { email?: unknown } | undefined)?.email !== credentials.email) {
    throw new Error("Authenticated viewer did not resolve from the session cookie.");
  }

  const logout = await authRequest(port, "mutation Logout { logout { success } }", undefined, cookies, csrf);
  if ((logout.payload.data?.logout as { success?: unknown } | undefined)?.success !== true) {
    throw new Error("CSRF-protected logout did not succeed.");
  }

  const replay = await authRequest(port, "query Viewer { viewer { email } }", undefined, cookies);
  if (replay.payload.data?.viewer !== null) {
    throw new Error("Revoked session cookie still resolved a viewer.");
  }

  const unknown = await authRequest(port, "mutation Login($input: CredentialsInput!) { login(input: $input) { viewer { email } } }", { input: { ...credentials, email: "missing@careerprofile.test" } });
  const wrongPassword = await authRequest(port, "mutation Login($input: CredentialsInput!) { login(input: $input) { viewer { email } } }", { input: { ...credentials, password: "WrongPassword!1" } });
  const unknownError = unknown.payload.errors?.[0];
  const wrongPasswordError = wrongPassword.payload.errors?.[0];
  if (unknownError?.extensions?.code !== "INVALID_CREDENTIALS" || unknownError.message !== wrongPasswordError?.message) {
    throw new Error("Unknown-user and wrong-password login outcomes are distinguishable.");
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    await authRequest(port, "mutation Register($input: CredentialsInput!) { register(input: $input) { viewer { email } } }", { input: { email: "invalid", password: credentials.password } });
  }
  const rateLimited = await authRequest(port, "mutation Register($input: CredentialsInput!) { register(input: $input) { viewer { email } } }", { input: { email: "rate-limit@careerprofile.test", password: credentials.password } });
  if (rateLimited.payload.errors?.[0]?.extensions?.code !== "RATE_LIMITED") {
    throw new Error("Registration attempts did not enforce the IP throttle.");
  }
}

async function expectInvalidSetupGrant(action: () => Promise<unknown>): Promise<void> {
  try {
    await action();
  } catch (error) {
    if (error instanceof AuthError && error.extensions.code === "INVALID_SETUP_GRANT") return;
    throw error;
  }
  throw new Error("An invalid or replayed password setup proof was accepted.");
}

async function smokeSetupGrantLifecycle(databaseUrl: string): Promise<void> {
  const database = createDatabase(databaseUrl);
  try {
    const user = (await database.db.insert(users).values({
      email: "verify-setup@careerprofile.test",
      normalizedEmail: "verify-setup@careerprofile.test",
      onboardingCompletedAt: new Date(),
      passwordSetupRequired: true,
      role: "USER",
    }).returning())[0];
    if (!user) throw new Error("Could not create the controlled password-setup fixture.");

    const auth = new AuthService(database, "verify-session-secret");
    const supersededProof = await auth.issueSetupGrant(user.id, "FIRST_PASSWORD");
    const activeProof = await auth.issueSetupGrant(user.id, "FIRST_PASSWORD");
    await expectInvalidSetupGrant(() => auth.setPassword({ proof: supersededProof, password: "ValidPassword!1" }, "verify-setup-ip"));

    const established = await auth.setPassword({ proof: activeProof, password: "ValidPassword!1" }, "verify-setup-ip");
    if (!established.viewer.onboardingCompleted || established.viewer.passwordSetupRequired) {
      throw new Error("Password setup changed the independent onboarding state or did not establish credentials.");
    }
    await expectInvalidSetupGrant(() => auth.setPassword({ proof: activeProof, password: "ValidPassword!1" }, "verify-setup-ip"));
  } finally {
    await database.close();
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
  loadEnvironmentFile();
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
    await smokeSetupGrantLifecycle(temporaryUrl);
    console.log("Isolated verification passed.");
  } finally {
    try {
      if (api) await stopApi(api);
    } finally {
      await maintenancePool.query(`DROP DATABASE IF EXISTS ${databaseIdentifier(temporaryName)} WITH (FORCE)`).catch(() => {});
      await maintenancePool.end();
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await verify();
  } catch (error) {
    console.error(`Verification failed: ${safeOutput(error instanceof Error ? error.message : String(error))}`);
    process.exitCode = 1;
  }
}
