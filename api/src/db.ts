import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://profile_app:profile_app@localhost:5433/career_profile";

export const pool = new pg.Pool({ connectionString });
export const db = drizzle(pool);

export async function pingDatabase(): Promise<void> {
  await db.execute(sql`SELECT 1`);
}
