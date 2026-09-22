import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Algorithm, hash } from "@node-rs/argon2";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { loadRuntimeConfig } from "../src/config.js";
import { userProfiles, users } from "../src/db/schema.js";
import { normalizeEmail, validatePassword } from "../src/auth/service.js";

type SeedUser = { email: string; password?: string; passwordSetupRequired?: boolean; role: "USER" | "ADMIN"; onboardingCompleted: boolean };
const passwordOptions = { algorithm: Algorithm.Argon2id, memoryCost: 19_456, timeCost: 2, parallelism: 1, outputLen: 32 } as const;
const seedPath = resolve(import.meta.dirname, "../../db/seeds/users.seed.json");
const config = loadRuntimeConfig();
const pool = new pg.Pool({ connectionString: config.databaseUrl });
const db = drizzle(pool);

try {
  const seedUsers = JSON.parse(await readFile(seedPath, "utf8")) as SeedUser[];
  for (const seedUser of seedUsers) {
    if (seedUser.passwordSetupRequired && seedUser.password) throw new Error(`Seed account ${seedUser.email} cannot have both a password and setup-required state.`);
    if (!seedUser.passwordSetupRequired && !seedUser.password) throw new Error(`Seed account ${seedUser.email} requires a password.`);
    if (seedUser.password) validatePassword(seedUser.password);
    const passwordHash = seedUser.password ? await hash(seedUser.password, passwordOptions) : null;
    const created = await db.insert(users).values({ email: seedUser.email, normalizedEmail: normalizeEmail(seedUser.email), passwordHash, passwordSetupRequired: Boolean(seedUser.passwordSetupRequired), role: seedUser.role, onboardingCompletedAt: seedUser.onboardingCompleted ? new Date("2026-01-01T00:00:00.000Z") : null }).onConflictDoNothing().returning({ id: users.id });
    if (created[0]) await db.insert(userProfiles).values({ userId: created[0].id });
  }
  console.log("Authentication seed data is up to date.");
} finally {
  await pool.end();
}
