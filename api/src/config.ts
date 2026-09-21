import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

export type RuntimeConfig = {
  databaseUrl: string;
  host: string;
  nodeEnv: "development" | "test" | "production";
  port: number;
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

export function parseRuntimeConfig(environment: NodeJS.ProcessEnv): RuntimeConfig {
  const nodeEnv = environment.NODE_ENV ?? "development";
  if (nodeEnv !== "development" && nodeEnv !== "test" && nodeEnv !== "production") {
    throw new Error("NODE_ENV must be development, test, or production.");
  }

  const host = environment.HOST ?? "0.0.0.0";
  if (!host.trim()) {
    throw new Error("HOST must not be empty.");
  }

  return {
    databaseUrl: parseDatabaseUrl(environment.DATABASE_URL),
    host,
    nodeEnv,
    port: parsePort(environment.PORT),
    verifyInstanceId: environment.VERIFY_INSTANCE_ID,
  };
}

export function loadRuntimeConfig(): RuntimeConfig {
  if (existsSync(".env")) {
    loadEnvFile(".env");
  }

  return parseRuntimeConfig(process.env);
}
