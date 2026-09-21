import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const legacyMigration = "001_init.sql";
const migrationFolder = resolve(dirname(fileURLToPath(import.meta.url)), "../../db/migrations");

function databaseUrlFromEnvironment(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to run migrations.");
  }

  return databaseUrl;
}

async function reconcileLegacyMigrationHistory(pool: pg.Pool): Promise<void> {
  const tableResult = await pool.query<{ exists: string | null }>(
    "SELECT to_regclass('public.schema_migrations') AS exists"
  );

  if (!tableResult.rows[0]?.exists) {
    return;
  }

  const legacyRows = await pool.query<{ name: string }>(
    "SELECT name FROM public.schema_migrations ORDER BY name"
  );
  const names = legacyRows.rows.map((row) => row.name);

  if (names.length !== 1 || names[0] !== legacyMigration) {
    throw new Error(
      "Legacy schema_migrations contains unexpected history. Resolve it manually before adopting Drizzle migrations."
    );
  }

  await pool.query("DROP TABLE public.schema_migrations");
  console.log("Retired the legacy no-op migration marker.");
}

const pool = new pg.Pool({ connectionString: databaseUrlFromEnvironment() });

try {
  await reconcileLegacyMigrationHistory(pool);
  await migrate(drizzle(pool), { migrationsFolder: migrationFolder });
  console.log("Drizzle migrations are up to date.");
} finally {
  await pool.end();
}
