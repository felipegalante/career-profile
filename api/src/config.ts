import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadEnvFile } from "node:process";

export type RuntimeConfig = {
  appOrigin: string;
  databaseUrl: string;
  host: string;
  nodeEnv: "development" | "test" | "production";
  port: number;
  sessionCookieName: string;
  sessionSecret: string;
  trustProxy: boolean;
  verifyInstanceId?: string;
};

function parsePort(value: string | undefined): number {
  if (value === undefined) return 3001;

  const port = Number(value);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error("PORT must be an integer between 0 and 65535.");
  }

  return port;
}

function parseOrigin(value: string | undefined, nodeEnv: "development" | "test" | "production"): string {
  const origin = value ?? (nodeEnv === "production" ? undefined : "http://localhost:5173");
  if (!origin) throw new Error("APP_ORIGIN is required in production.");
  const parsed = new URL(origin);
  if (parsed.origin !== origin.replace(/\/$/, "")) throw new Error("APP_ORIGIN must be an origin without a path.");
  return parsed.origin;
}

function parseDatabaseUrl(value: string | undefined): string {
  if (!value) {
    throw new Error("DATABASE_URL is required.");
  }

  const url = new URL(value);
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error("DATABASE_URL must use the postgres protocol.");
  }

  return value;
}

function parseTrustProxy(value: string | undefined): boolean {
  if (value === undefined || value === "false") return false;
  if (value === "true") return true;
  throw new Error("TRUST_PROXY must be true or false.");
}

export function parseRuntimeConfig(environment: NodeJS.ProcessEnv): RuntimeConfig {
  const nodeEnv = environment.NODE_ENV ?? "development";
  if (nodeEnv !== "development" && nodeEnv !== "test" && nodeEnv !== "production") {
    throw new Error("NODE_ENV must be development, test, or production.");
  }

  const host = environment.HOST ?? "0.0.0.0";
  if (!host.trim()) {
    throw new Error("HOST must not be empty.");
  }

  const sessionSecret = environment.SESSION_SECRET ?? (nodeEnv === "test" ? "test-session-secret-not-for-production" : "");
  if (nodeEnv === "production" && sessionSecret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters in production.");

  return {
    appOrigin: parseOrigin(environment.APP_ORIGIN, nodeEnv),
    databaseUrl: parseDatabaseUrl(environment.DATABASE_URL),
    host,
    nodeEnv,
    port: parsePort(environment.PORT),
    sessionCookieName: environment.SESSION_COOKIE_NAME ?? (nodeEnv === "production" ? "__Host-career_profile_session" : "career_profile_session"),
    sessionSecret,
    trustProxy: parseTrustProxy(environment.TRUST_PROXY),
    verifyInstanceId: environment.VERIFY_INSTANCE_ID,
  };
}

export function loadEnvironmentFile(): void {
  const environmentFile = fileURLToPath(new URL("../../.env", import.meta.url));
  if (existsSync(environmentFile)) {
    const suppliedValues = new Map(Object.entries(process.env));
    loadEnvFile(environmentFile);
    for (const [name, value] of suppliedValues) {
      process.env[name] = value;
    }
  }
}

export function loadRuntimeConfig(): RuntimeConfig {
  loadEnvironmentFile();
  return parseRuntimeConfig(process.env);
}
