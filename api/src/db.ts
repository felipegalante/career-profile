import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

export type AppDatabase = {
  readonly db: ReturnType<typeof drizzle>;
  close(): Promise<void>;
  ping(): Promise<void>;
};

export function createDatabase(connectionString: string): AppDatabase {
  const pool = new pg.Pool({ connectionString });
  const db = drizzle(pool);

  return {
    db,
    close: () => pool.end(),
    ping: async () => {
      await db.execute(sql`SELECT 1`);
    },
  };
}
