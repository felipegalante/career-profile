import { defineConfig } from "drizzle-kit";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

const environmentFile = fileURLToPath(new URL("../.env", import.meta.url));
if (existsSync(environmentFile)) {
  const suppliedValues = new Map(Object.entries(process.env));
  loadEnvFile(environmentFile);
  for (const [name, value] of suppliedValues) {
    process.env[name] = value;
  }
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for Drizzle Kit.");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "../db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
